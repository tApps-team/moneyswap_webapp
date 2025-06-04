import { Grade } from "@/shared/types";
import {
  ReviewResponse,
} from "../model/types/reviewType";

export type ReviewsByExchangeDtoResponse = ReviewResponse;
export type ReviewsByExchangeDtoRequest = {
  exchange_name: string;
  review_id?: number;
  page: number;
  element_on_page?: number;
  grade_filter?: Grade;
};

export type AddReviewByExchangeDtoResponse = string;
export type AddReviewByExchangeDtoRequset = {
  exchange_name: string;
  tg_id: number;
  text: string;
  grade: Grade;
  transaction_id?: string | null;
};

export type CheckUserReviewPermissionDtoResponse = {
  status: "success";
};
export type CheckUserReviewPermissionDtoRequest = {
  exchange_name: string;
  tg_id: number;
};
