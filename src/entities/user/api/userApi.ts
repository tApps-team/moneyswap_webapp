import { baseApi } from "@/shared/api";
import { IncreaseLinkCountReq } from "./userDto";

export const userAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    increaseLinkCount: build.mutation<void, IncreaseLinkCountReq>({
      query: (body) => ({
        url: `/api/v2/increase_link_count`,
        method: "POST",
        body,
      }),
    }),
    // increaseLinkCountPartners: build.mutation<
    //   void,
    //   IncreaseLinkCountPartnersReq
    // >({
    //   query: (body) => ({
    //     url: `/api/partner/increase_link_count`,
    //     method: "POST",
    //     body,
    //   }),
    // }),
  }),
});
export const {
  useIncreaseLinkCountMutation,
} = userAPI;
