import { CurrencyCategory } from "../model/types/types";

export type AvailableValutesDtoResponse = CurrencyCategory;
export type AvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};
