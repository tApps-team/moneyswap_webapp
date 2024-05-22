import { baseApi } from "@/shared/api";
import {
  ReviewsByExchangeDtoRequest,
  ReviewsByExchangeDtoResponse,
} from "./reviewDto";
import { createUrl } from "../utils/createUrl";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reviewsByExchange: build.query<
      ReviewsByExchangeDtoResponse,
      ReviewsByExchangeDtoRequest
    >({
      query: (data) => ({
        url: createUrl(data),
        method: "GET",
      }),
    }),
  }),
});
