import { CurrencyCategory } from "../model/types/currency";

export type AvailableValutesDtoResponse = CurrencyCategory;
export type AvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};
