export const setEnum = (currentEnum: number) => {
  localStorage.setItem("enum", JSON.stringify(currentEnum));
};
export const getEnum = () => {
  const k = localStorage.getItem("enum");
  if (k) {
    return JSON.parse(k) as number;
  } else {
    localStorage.setItem("enum", JSON.stringify(0));
    return 0;
  }
};
