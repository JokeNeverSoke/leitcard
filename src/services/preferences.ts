type ISetPereferenceOverload = {
  (key: string, value: any): void;
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

export const getPreference = (key?: keyof Preference) => {
  const currentP: Preference = JSON.parse(
    localStorage.getItem("preference") || "null"
  ) || {
    finishAllFirstLevel: true,
  };
  if (key) {
    return currentP[key];
  } else {
    return currentP;
  }
};
