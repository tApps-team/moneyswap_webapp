import { Grade } from "@/shared/types";
import { Comment } from "../model/types/commentTypes";

export type CommentsByReviewRequest = {
  review_id: number;
};
export type CommentsByReviewResponse = Comment[];

export type AddCommentRequest = {
  review_id: number;
  tg_id: number;
  text: string;
  grade: Grade;
};
export type AddCommentResponse = {
  success: boolean;
};

export type CheckUserCommentPermissionRequest = {
  review_id: number;
  tg_id: number;
};
export type CheckUserCommentPermissionResponse = {
  success: boolean;
};