export type Review = {
  id: number;
  username: string;
  review_date: string;
  review_time: string;
  grade: Grade;
  text: string;
  comment_count: number;
};
export type ReviewResponse = {
  page: number;
  element_on_page: number;
  content: Review[];
  pages: number;
};
export enum ExchangerMarker {
  cash = "cash",
  no_cash = "no_cash",
  partner = "partner",
}
export enum Grade {
  positive = 1,
  neutral = 0,
  negative = -1,
  all = "all",
}
