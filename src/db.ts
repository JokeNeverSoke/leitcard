import dayjs from "dayjs";
import Dexie from "dexie";
import { exportDB, importInto } from "dexie-export-import";
import { getPreference, setPreference } from "./services/preferences";
import { getDate, getEnum, setDate, setEnum } from "./services/schedule";

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

interface FinalExport {
  db: string;
  date: string;
  enum: number;
  pref: Preference;
}

export const exportCurrent = async () => {
  const dbP = exportDB(db)
    .then((blob) => blob.text())
    .then((text) => btoa(text));
  const currentDate = getDate();
  const currentEnum = getEnum();
  const currentPref = getPreference() as Preference;
  const currentDB = await dbP;
  const final: FinalExport = {
    db: currentDB,
    date: currentDate.format(),
    enum: currentEnum,
    pref: currentPref,
  };
  return btoa(JSON.stringify(final));
};

export const importCurrent = async (v: string) => {
  const i = JSON.parse(atob(v)) as FinalExport;
  const currentDate = dayjs(i.date);
  const currentEnum = i.enum;
  const currentPref = i.pref;
  const k = db.cards.clear().then(async () => {
    const dbJson = atob(i.db);
    await importInto(db, new Blob([dbJson]));
  });
  setPreference(currentPref);
  setEnum(currentEnum);
  setDate(currentDate);
  window.location.reload();
};
