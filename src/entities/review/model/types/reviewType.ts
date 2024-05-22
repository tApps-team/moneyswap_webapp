export type Review = {
  id: number;
  username: string;
  review_date: string;
  review_time: string;
  grade: number;
  text: string;
};
export type ReviewResponse = {
  page: number;
  element_on_page: number;
  content: Review[];
};
export type CurrencyType = "cash" | "no_cash";
