export type Currency = {
  id: number;
  name: string;
  code_name: string;
  icon_url: string;
};
export type CurrencyCategory = {
  ru: {
    [key: string]: Currency[];
  };
  en: {
    [key: string]: Currency[];
  };
};
export type CurrencyLang = {
  id: number;
  name: {
    ru: string;
    en: string;
  };
  code_name: string;
  icon_url: string;
};
export type CurrencySchema = {
  giveCurrency?: CurrencyLang | null;
  getCurrency?: CurrencyLang | null;
  giveCashCurrency?: CurrencyLang | null;
  getCashCurrency?: CurrencyLang | null;
};
