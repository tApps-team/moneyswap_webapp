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
