import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  configureStore,
  createSelector,
  nanoid,
  Store,
} from "@reduxjs/toolkit";
import { createSelectorCreator, defaultMemoize } from "reselect";
import equal from "fast-deep-equal";
import * as Sentry from "@sentry/react";

import cards, { addCard } from "./cards";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

export const store = configureStore({
  reducer: {
    cards,
  },
  enhancers: [sentryReduxEnhancer],
});

export type RootState = ReturnType<typeof store.getState>;

const createDeepSelector = createSelectorCreator(defaultMemoize, (a, b) =>
  equal(a, b)
);

export const selectCardsInLevel = (level: number) => (state: RootState) =>
  state.cards.levels[level];

export const selectTodayLevel = ({ cards: s }: RootState) =>
  s.schedule[s.currentEnum % s.schedule.length];

export const selectAllLevels = ({ cards }: RootState) => cards.levels;

export const selectGradCards = ({ cards }: RootState) => cards.grads;

export const selectAllCards = createSelector(
  [selectAllLevels, selectGradCards],
  (allLevels, gradCards) => {
    let allCards: Card[] = [];
    allLevels.forEach((level) => {
      allCards = allCards.concat(level);
    });
    return allCards.concat(gradCards);
  }
);

export const selectTodoCards = createSelector(
  [
    selectTodayLevel,
    (state) => state.cards.levels,
    (state) => state.cards.currentEnum,
  ],
  (todayLevel, levels, currentEnum) => {
    return levels[todayLevel[0]]
      .concat(levels[todayLevel[1]])
      .filter((c) => c.lastEnum < currentEnum);
  }
);

export const selectCardsCompletedToday = createDeepSelector(
  [selectAllCards, (state) => state.cards.currentEnum],
  (allCards, currentEnum) => {
    return allCards.filter((c) => c.lastEnum === currentEnum);
  }
);

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
