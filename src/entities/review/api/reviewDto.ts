import { ExchangerMarker } from "@/shared/types";
import {
  Grade,
  ReviewResponse,
} from "../model/types/reviewType";

export type ReviewsByExchangeDtoResponse = ReviewResponse;
export type ReviewsByExchangeDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  review_id?: number;
  page: number;
  element_on_page?: number;
  grade_filter?: Grade;
};

export type AddReviewByExchangeDtoResponse = string;
export type AddReviewByExchangeDtoRequset = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  tg_id: number;
  text: string;
  grade: Grade;
  transaction_id?: string | null;
};

export type CheckUserReviewPermissionDtoResponse = {
  status: "success";
};
export type CheckUserReviewPermissionDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  tg_id: number;
};
