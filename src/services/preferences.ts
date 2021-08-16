type ISetPereferenceOverload = {
  <T extends keyof Preference>(key: T, value: Preference[T]): void;
  (pref: Preference): void;
};

export const setPreference: ISetPereferenceOverload = (
  arg: string | Preference,
  value?: any
) => {
  if (typeof arg === "string") {
    const currentP =
      JSON.parse(localStorage.getItem("preference") || "null") || {};
    currentP[arg] = value;
    localStorage.setItem("preference", JSON.stringify(currentP));
  } else {
    localStorage.setItem("preference", JSON.stringify(arg));
  }
};

type IPreferenceOverload = {
  <T extends keyof Preference>(param: T): Preference[T];
  (): Preference;
};

export function getPreference<T extends keyof Preference>(param: T): Preference[T];
export function getPreference(): Preference;
export function getPreference(key?: keyof Preference): any {
  const currentP: Preference = JSON.parse(
    localStorage.getItem("preference") || "null"
  ) || {
    finishAllFirstLevel: true,
    autoSave: true,
    saveUri: null,
  };
  if (key) {
    const u = currentP[key];
    return u;
  } else {
    return currentP;
  }
}
