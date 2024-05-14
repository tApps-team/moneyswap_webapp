import { CurrencySchema } from "../types/currency";

export const getCurrency = (state: CurrencySchema) => {
  return state.getCurrency;
};
export const giveCurrency = (state: CurrencySchema) => {
  return state.giveCurrency;
};
export const getCashCurrency = (state: CurrencySchema) => {
  return state.getCashCurrency;
};
export const giveCashCurrency = (state: CurrencySchema) => {
  return state.giveCashCurrency;
};
