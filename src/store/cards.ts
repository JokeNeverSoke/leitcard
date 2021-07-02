import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { generateSchedule } from "../utils/generateSchedule";
import {
  addCardToDB,
  getLevelsFromDB,
  updatePostFromDB,
  findCardByIdFromDB,
  deleteCardFromDB,
} from "../services/cards";
import { RootState } from ".";
import { getDate, getEnum, setDate, setEnum } from "../services/schedule";

declare global {
  interface Card {
    id: string;
    status: number | "grad";
    question: string;
    answer: string;
    lastEnum: number;
    creationTime: ReturnType<dayjs.Dayjs["format"]>;
  }

  interface ActiveCard extends Card {
    status: Exclude<Card["status"], "grad">;
  }

  type Schedule = Array<[number, number]>;
}

interface CardsState {
  levels: Array<ActiveCard[]>;
  grads: Card[];
  currentEnum: number;
  schedule: Schedule;
}

const initialState: CardsState = {
  levels: [[], [], [], [], [], [], []],
  grads: [],
  currentEnum: 0,
  schedule: generateSchedule(),
};

const isActive = (card: Card | ActiveCard): card is ActiveCard => {
  return card.status !== "grad";
};

const isNewDay = (old: dayjs.Dayjs, next: dayjs.Dayjs) => {
  return old.isBefore(next, "day");
};

const removeCardFromDeck = <T extends Card | ActiveCard>(
  deck: T[],
  card: T
) => {
  return deck.filter((c) => c.id !== card.id);
};

export const fetchLevelFromDB = createAsyncThunk(
  "cards/fetchLevelFromDb",
  async (level: number, {}) => {
    return { level, cards: await getLevelsFromDB(level) };
  }
);

export const upgradeCard = createAsyncThunk(
  "cards/upgradeCard",
  async (card: ActiveCard, { getState, dispatch }) => {
    const state = getState() as RootState;
    const nextLevel =
      card.status === state.cards.levels.length - 1 ? "grad" : card.status + 1;
    const currentEnum = state.cards.currentEnum;
    dispatch(
      updatePostToDB({ ...card, status: nextLevel, lastEnum: currentEnum })
    );
  }
);

export const resetCard = createAsyncThunk(
  "cards/resetCard",
  async (card: ActiveCard, { getState, dispatch }) => {
    const state = getState() as RootState;
    const nextLevel = 0;

    const currentEnum = state.cards.currentEnum;
    dispatch(
      updatePostToDB({ ...card, status: nextLevel, lastEnum: currentEnum })
    );
  }
);

export const updatePostToDB = createAsyncThunk(
  "cards/updatePostToDB",
  async (card: Card, {}) => {
    const oldCard = await findCardByIdFromDB(card.id);
    if (!oldCard || !isActive(oldCard))
      throw "inactive card cannot be modified";
    await updatePostFromDB(card);
    return { card, oldCard };
  }
);

export const addCard = createAsyncThunk(
  "cards/addCard",
  async (card: Omit<Card, "id" | "creationTime" | "lastEnum" | "status">) => {
    const newCard: ActiveCard = {
      ...card,
      id: nanoid(),
      creationTime: dayjs().format(),
      lastEnum: -1,
      status: 0,
    };
    await addCardToDB(newCard);
    return newCard;
  }
);

export const deleteCard = createAsyncThunk(
  "cards/deleteCard",
  async (card: ActiveCard | Card) => {
    await deleteCardFromDB(card);
    return card;
  }
);

export const incrementDate = () => {
  return (
    dispatch: (arg0: { payload: number | undefined; type: string }) => void,
    getState: () => RootState
  ) => {
    const oldState = getState();
    const newDate = oldState.cards.currentEnum + 1;
    setEnum(newDate);
    dispatch(changeDate(newDate));
  };
};

export const syncDate = () => {
  return (
    dispatch: (
      arg0: (
        dispatch: (arg0: { payload: number | undefined; type: string }) => void,
        getState: () => RootState
      ) => void
    ) => void
  ) => {
    const old = getDate();
    const next = dayjs();
    if (isNewDay(old, next)) {
      dispatch(incrementDate());
      setDate(next);
    }
  };
};

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    resetCard: (state, action: PayloadAction<ActiveCard>) => {
      const card = action.payload;
      const nextLevel = 0;
      state.levels[card.status] = removeCardFromDeck(
        state.levels[card.status],
        card
      );
      const newCard: ActiveCard = {
        ...card,
        status: nextLevel,
        lastEnum: state.currentEnum,
      };
      if (isActive(newCard)) {
        state.levels[newCard.status].push(newCard);
      } else {
        state.grads.push(newCard);
      }
    },
    addCard: {
      reducer(state, action: PayloadAction<Card>) {
        const card: Card = { ...action.payload };
        if (!isActive(card)) {
          state.grads.push(card);
        } else {
          state.levels[card.status].push(card);
        }
      },
      prepare(card: Omit<Card, "id" | "lastEnum" | "creationTime" | "status">) {
        const payload = {
          ...card,
          id: nanoid(),
          lastEnum: -1,
          creationTime: dayjs().format(),
          status: 0,
        };
        return {
          payload,
        };
      },
    },

    refreshSchedule: {
      reducer(state, action: PayloadAction<Schedule>) {
        state.schedule = action.payload;
      },
      prepare(level: number) {
        return {
          payload: generateSchedule(level),
        };
      },
    },
    changeDate: (state, action: PayloadAction<number | undefined>) => {
      const n = action.payload;
      if (n) {
        state.currentEnum = n;
      } else {
        state.currentEnum++;
      }
    },
    syncEnum: {
      reducer(state, action: PayloadAction<number>) {
        state.currentEnum = action.payload;
      },
      prepare() {
        const currentEnum = getEnum();
        return { payload: currentEnum };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLevelFromDB.fulfilled, (state, { payload }) => {
      state.levels[payload.level] = payload.cards;
    });
    builder.addCase(updatePostToDB.fulfilled, (state, { payload }) => {
      const { card, oldCard } = payload;
      const from = oldCard.status;
      state.levels[from] = removeCardFromDeck(
        state.levels[oldCard.status],
        oldCard
      );
      if (isActive(card)) {
        state.levels[card.status].push(card);
      } else {
        state.grads.push(card);
      }
    });
    builder.addCase(addCard.fulfilled, (state, { payload }) => {
      const card = payload;
      const to = payload.status;
      state.levels[to].push(card);
    });
    builder.addCase(deleteCard.fulfilled, (state, { payload }) => {
      const card = payload;
      if (!isActive(card)) {
        state.grads = removeCardFromDeck(state.grads, card);
      } else {
        const from = card.status;
        state.levels[from] = removeCardFromDeck(
          state.levels[card.status],
          card
        );
      }
    });
  },
});

export const { refreshSchedule, changeDate, syncEnum } = cardsSlice.actions;

export default cardsSlice.reducer;
