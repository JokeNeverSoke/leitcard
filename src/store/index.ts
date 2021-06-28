import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, nanoid, Store } from "@reduxjs/toolkit";

import cards, { addCard } from "./cards";

export const store = configureStore({
  reducer: {
    cards,
  },
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
