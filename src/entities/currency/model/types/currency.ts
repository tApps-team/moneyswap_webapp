import { Name } from "@/shared/config";

export type Currency = {
  id: number;
  name: Name;
  code_name: string;
  icon_url: string;
  is_popular?: boolean;
};
export type CurrencyValutes = {
  id: number;
  name: Name;
  currencies: Currency[];
};
export type CurrencySchema = {
  giveCurrency: Currency | null;
  getCurrency: Currency | null;
  giveCashCurrency: Currency | null;
  getCashCurrency: Currency | null;
};
