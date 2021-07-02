interface Rank {
  title: string;
  color: string;
}

const ranks: Rank[] = [
  {
    title: "Novice",
    color: "gray.400",
  },
  {
    title: "Enthusiastic",
    color: "teal.400",
  },
  {
    title: "Expert",
    color: "cyan.400",
  },
];

export const getStatus = (count: number) => {
  if (count === 0) {
    return ranks[0];
  } else if (count < 100) {
    return ranks[1];
  } else if (count < 200) {
    return ranks[2];
  } else {
    return ranks[ranks.length - 1];
  }
};
