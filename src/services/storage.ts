import axios from "axios";
import equal from "fast-deep-equal";
import { getAllData, saveAllData } from "../db";
import { store } from "../store";
import { setPref } from "../store/cards";
import { getPreference, setPreference } from "./preferences";
import { getEnum } from "./schedule";

const putBackup = async (uri: string, data: FinalExport) => {
  await axios.put("https://api.jsonstorage.net/v1/json/" + uri, data);
};

const fetchBackup = async (uri: string) => {
  return (await axios.get("https://api.jsonstorage.net/v1/json/" + uri))
    .data as FinalExport;
};

export const addBackup = async () => {
  const data = await getAllData();
  const uri = ((await axios.post("https://api.jsonstorage.net/v1/json", data))
    .data.uri as string)
    .split("/")
    .reverse()[0];
  store.dispatch(setPref("saveUri", uri));
  await saveBackup();
};

export const saveBackup = async () => {
  const uri = store.getState().cards.preference.saveUri;
  if (!uri) return;
  const currentEnum = getEnum();

  const e = await fetchBackup(uri);
  if (e.enum > currentEnum) {
    return;
  }
  const data = await getAllData();
  await putBackup(uri, data);
};

export const loadBackup = async () => {
  const uri = store.getState().cards.preference.saveUri;
  if (!uri) return;
  const e = await fetchBackup(uri);
  const currentEnum = getEnum();
  if (e.enum < currentEnum) {
    return;
  }
};

export const backupWorker = () => {
  console.log("worker run");
  const pref = store.getState().cards.preference;
  console.log({ pref });
  if (pref.autoSave) {
    if (pref.saveUri) {
      console.log("second time");
      saveBackup();
    } else {
      console.log("first time");
      addBackup();
    }
  }
};
