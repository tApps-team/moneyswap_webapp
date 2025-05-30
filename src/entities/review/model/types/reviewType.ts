import { Grade } from "@/shared/types";

export type Review = {
  id: number;
  username: string;
  review_date: string;
  review_time: string;
  review_from: ReviewFrom;
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
export enum ReviewFrom {
  moneyswap = "moneyswap",
  bestchange = "bestchange",
}

