import { baseApi } from "@/shared/api";
import {
  AddReviewByExchangeDtoRequset,
  AddReviewByExchangeDtoResponse,
  CheckUserReviewPermissionDtoRequest,
  CheckUserReviewPermissionDtoResponse,
  ReviewsByExchangeDtoRequest,
  ReviewsByExchangeDtoResponse,
} from "./reviewDto";
import { RootState } from "@/app/providers/storeProvider";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reviewsByExchange: build.query<
      ReviewsByExchangeDtoResponse,
      ReviewsByExchangeDtoRequest
    >({
      query: (data) => ({
        url: `api/test/reviews_by_exchange`,
        params: data,
        method: "GET",
      }),

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { exchange_name, grade_filter } = queryArgs;
        return (
          endpointName + exchange_name + (grade_filter ? grade_filter : "all")
        );
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        if (newItems.page === 1) {
          currentCache.content = newItems.content;
        } else {
          currentCache.content.push(...newItems.content);
        }
        currentCache.page = newItems.page;
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.grade_filter !== previousArg?.grade_filter ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          currentArg?.page! > previousArg?.page!
        );
      },
    }),
    addReviewByExchange: build.mutation<
      AddReviewByExchangeDtoResponse,
      AddReviewByExchangeDtoRequset
    >({
      query: (data) => ({
        url: `/api/test/add_review_by_exchange`,
        body: data,
        method: "POST",
      }),
    }),
    checkUserReviewPermission: build.query<
      CheckUserReviewPermissionDtoResponse,
      CheckUserReviewPermissionDtoRequest
    >({
      query: (params) => ({
        url: `/api/test/check_user_review_permission`,
        params: params,
        method: "GET",
      }),
    }),
  }),
});

export const selectCacheByKey =
  (exchange_name: string, grade_filter?: number | "all") =>
  (state: RootState) => {
    return state.api.queries[
      "reviewsByExchange" + exchange_name + (grade_filter ? grade_filter : "all")
    ]?.data as ReviewsByExchangeDtoResponse;
  };

export const {
  useReviewsByExchangeQuery,
  useLazyReviewsByExchangeQuery,
  useAddReviewByExchangeMutation,
  useLazyCheckUserReviewPermissionQuery,
  useCheckUserReviewPermissionQuery,
} = reviewApi;
