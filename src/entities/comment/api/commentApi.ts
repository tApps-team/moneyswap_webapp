import { baseApi } from "@/shared/api";
import {
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
        url: `api/reviews/get_comments_by_review`,
        params,
        method: "GET",
      }),
    }),
  }),
});

export const { useCommentsByReviewQuery, useLazyCommentsByReviewQuery } =
  commentApi;
