import Dexie from "dexie";

class LeitcardDatabase extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  cards: Dexie.Table<Omit<Card, "id">, string>; // number = type of the primkey

  constructor() {
    super("LeitcardDatabase");
    this.version(1).stores({
      cards: "++id, question, answer, lastEnum, creationTime, status",
    });
    this.cards = this.table("cards");
  }
}

export const db = new LeitcardDatabase();
