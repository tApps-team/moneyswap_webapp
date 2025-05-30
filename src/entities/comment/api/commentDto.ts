import { ExchangerMarker, Grade } from "@/shared/types";
import { Comment } from "../model/types/commentTypes";

export type CommentsByReviewRequest = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  review_id: number;
};
export type CommentsByReviewResponse = Comment[];

export type AddCommentRequest = {
  exchange_marker: ExchangerMarker;
  review_id: number;
  tg_id: number;
  text: string;
  grade: Grade;
};
export type AddCommentResponse = {
  success: boolean;
};

export type CheckUserCommentPermissionRequest = {
  exchange_marker: ExchangerMarker;
  review_id: number;
  tg_id: number;
};
export type CheckUserCommentPermissionResponse = {
  success: boolean;
};