import {
  ExchangerMarker,
  Grade,
  ReviewResponse,
} from "../model/types/reviewType";

export type ReviewsByExchangeDtoResponse = ReviewResponse;
export type ReviewsByExchangeDtoRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  page: number;
  element_on_page?: number;
  grade_filter?: Grade;
};
