import { ExchangerMarker } from "@/shared/types";
import { Comment } from "../model/types/commentTypes";

export type CommentsByReviewRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  review_id: number;
};
export type CommentsByReviewResponse = Comment[];
