import { CurrencyValutes } from "../model/types/currency";

export type GetAvailableValutesDtoResponse = CurrencyValutes;
export type GetAvailableValutesDtoRequest = {
  city?: string;
  base?: string;
};
