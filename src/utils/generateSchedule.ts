export const generateSchedule = (level = 7): Schedule => {
  if (level == 2) {
    return [[0, 1]];
  } else {
    const k: Schedule = generateSchedule(level - 1);
    const u: Schedule = k.concat([[0, level - 1]], k);
    return u;
  }
};
