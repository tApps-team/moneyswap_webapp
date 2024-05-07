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

export type CurrencySchema = {
  giveCurrency?: Currency | null;
  getCurrency?: Currency | null;
  giveCashCurrency?: Currency | null;
  getCashCurrency?: Currency | null;
};
