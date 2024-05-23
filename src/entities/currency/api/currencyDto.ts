import { CurrencyLangCategory } from "../model/types/currency";

export type AvailableValutesDtoResponse = CurrencyLangCategory;
export type AvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};
