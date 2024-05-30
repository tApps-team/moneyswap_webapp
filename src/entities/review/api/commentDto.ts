import { Comment } from "../model/types/commentType";
import { ExchangerMarker } from "../model/types/reviewType";

export type CommentsByReviewRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  review_id: number;
};
export type CommentsByReviewResponse = {
  reviews: Comment[];
};
