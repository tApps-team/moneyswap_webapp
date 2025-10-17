import { baseApi } from "@/shared/api";
import {
  AddCommentRequest,
  AddCommentResponse,
  CheckUserCommentPermissionRequest,
  CheckUserCommentPermissionResponse,
  CommentsByReviewRequest,
  CommentsByReviewResponse,
} from "./commentDto";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    commentsByReview: build.query<
      CommentsByReviewResponse,
      CommentsByReviewRequest
    >({
      query: (params) => ({
        url: `api/v2/reviews/get_comments_by_review`,
        params,
        method: "GET",
      }),
    }),
    addComment: build.mutation<AddCommentResponse, AddCommentRequest>({
      query: (body) => ({
        url: `api/v2/reviews/add_comment_by_review`,
        body,
        method: "POST",
      }),
    }),
    checkUserCommentPermission: build.mutation<CheckUserCommentPermissionResponse, CheckUserCommentPermissionRequest>({
      query: (params) => ({
        url: `api/v2/reviews/check_user_comment_permission`,
        params,
        method: "GET",
      }),
    }),
  }),
});

export const { useCommentsByReviewQuery, useLazyCommentsByReviewQuery, useAddCommentMutation, useCheckUserCommentPermissionMutation } =
  commentApi;
