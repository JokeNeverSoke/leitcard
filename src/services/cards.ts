import { db } from "../db";

export const addCardToDB = async (card: Card) => {
  db.cards.add(card, card.id);
};

export const getLevelsFromDB = async (level: number) => {
  let cards: ActiveCard[] = [];
  await db.cards
    .where("status")
    .equals(level)
    .eachPrimaryKey(async (key) => {
      cards.push({
        ...(await db.cards.where(":id").equals(key).toArray())[0],
        id: key,
      } as ActiveCard);
    });
  return cards;
};

export const updatePostFromDB = async (card: Card) => {
  await db.cards.update(card.id, card);
};

export const findCardByIdFromDB = async (id: Card["id"]) => {
  return { ...(await db.cards.get(id)), id } as Card;
};
