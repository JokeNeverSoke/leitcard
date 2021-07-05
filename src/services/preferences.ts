export const setPreference = (key: string, value: any) => {
  const currentP =
    JSON.parse(localStorage.getItem("preference") || "null") || {};
  currentP[key] = value;
  localStorage.setItem("preference", JSON.stringify(currentP));
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
