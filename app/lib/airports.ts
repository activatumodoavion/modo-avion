import { airportsData } from "./data/airportsData";

export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

export const airports: Airport[] = airportsData;