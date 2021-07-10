import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, nanoid, Store } from "@reduxjs/toolkit";
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

export const showCardsInLevel = (level: number) => (state: RootState) =>
  state.cards.levels[level];

export const selectTodayLevel = ({ cards: s }: RootState) =>
  s.schedule[s.currentEnum % s.schedule.length];

export const selectAllLevels = ({ cards }: RootState) => cards.levels;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
