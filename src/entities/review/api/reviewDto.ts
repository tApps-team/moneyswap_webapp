import { CurrencyType, ReviewResponse } from "../model/types/reviewType";

export type ReviewsByExchangeDtoResponse = ReviewResponse;
export type ReviewsByExchangeDtoRequest = {
  exchange_id: number;
  exchange_marker: CurrencyType;
  page: number;
  element_on_page: number;
  grade_filter: number;
};
