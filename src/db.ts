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

declare global {
  interface FinalExport {
    db: string;
    date: string;
    enum: number;
    pref: Preference;
  }
}

function b64EncodeUnicode(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export const getAllData = async () => {
  const dbP = exportDB(db)
    .then((blob) => blob.text())
    .then((text) => b64EncodeUnicode(text));
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
  return final;
};

export const exportCurrent = async () => {
  const final = await getAllData();
  return b64EncodeUnicode(JSON.stringify(final));
};

export const saveAllData = async (data: FinalExport) => {
  const currentDate = dayjs(data.date);
  const currentEnum = data.enum;
  const currentPref = data.pref;
  const k = db.cards.clear().then(async () => {
    const dbJson = b64DecodeUnicode(data.db);
    await importInto(db, new Blob([dbJson]));
  });
  setPreference(currentPref);
  setEnum(currentEnum);
  setDate(currentDate);
  window.location.reload();
};

export const importCurrent = async (v: string) => {
  const i = JSON.parse(b64DecodeUnicode(v)) as FinalExport;
  await saveAllData(i);
};
