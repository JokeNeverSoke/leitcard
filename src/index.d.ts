declare interface Card {
  id: string;
  status: number | "grad";
  question: string;
  answer: string;
  lastEnum: number;
  creationTime: ReturnType<Date["toISOString"]>;
}
declare interface ActiveCard extends Card {
  status: Exclude<Card["status"], "grad">;
}
declare type Schedule = Array<[number, number]>;
