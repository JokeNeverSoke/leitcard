import dayjs from "dayjs";
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

export const setDate = (date: dayjs.Dayjs | string) => {
  let k;
  if (typeof date === "string") {
    k = date;
  } else {
    k = date.format();
  }
  localStorage.setItem("lastDate", JSON.stringify(k));
};
export const getDate = () => {
  const k = localStorage.getItem("lastDate");
  if (k) {
    return dayjs(JSON.parse(k));
  } else {
    const d = dayjs();
    localStorage.setItem("lastDate", JSON.stringify(d.format()));
    return d;
  }
};
