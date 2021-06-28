import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { generateSchedule } from "../utils/generateSchedule";

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

const removeCardFromDeck = <T extends Card | ActiveCard>(
  deck: T[],
  card: T
) => {
  return deck.filter((c) => c.id !== card.id);
};

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    moveCard: (
      state,
      action: PayloadAction<{ to: Card["status"]; card: Card }>
    ) => {
      const { to, card } = action.payload;
      let newCard: Card;
      if (!isActive(card)) {
        newCard = state.grads.splice(state.grads.indexOf(card), 1)[0];
      } else {
        const from = card.status;
        newCard = state.levels[from].splice(
          state.levels[from].indexOf(card),
          1
        )[0];
      }
      newCard.status = to;
      if (!isActive(newCard)) {
        state.grads.push(newCard);
      } else {
        state.levels[newCard.status].push(newCard);
      }
    },
    deleteCard: (state, action: PayloadAction<Card>) => {
      const card = action.payload;
      if (!isActive(card)) {
        state.grads.splice(state.grads.indexOf(card));
      } else {
        const from = card.status;
        state.levels[from].splice(state.levels[from].indexOf(card));
      }
    },
    upgradeCard: (state, action: PayloadAction<ActiveCard>) => {
      const card = action.payload;
      const nextLevel =
        card.status === state.levels.length - 1 ? "grad" : card.status + 1;
      console.log(card.status, nextLevel);
      state.levels[card.status] = removeCardFromDeck(
        state.levels[card.status],
        card
      );
      const newCard: Card = {
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
          creationTime: new Date().toISOString(),
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
    incrementDate: (state) => {
      state.currentEnum++;
    },
  },
});

export const {
  moveCard,
  deleteCard,
  addCard,
  upgradeCard,
  resetCard,
  refreshSchedule,
  incrementDate,
} = cardsSlice.actions;

export default cardsSlice.reducer;
