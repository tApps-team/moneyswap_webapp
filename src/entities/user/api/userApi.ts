import { baseApi } from "@/shared/api";
import { IncreaseLinkCountPartnersReq, IncreaseLinkCountReq } from "./userDto";

export const userAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    increaseLinkCount: build.mutation<void, IncreaseLinkCountReq>({
      query: (body) => ({
        url: `/api/increase_link_count`,
        method: "POST",
        body,
      }),
    }),
    increaseLinkCountPartners: build.mutation<
      void,
      IncreaseLinkCountPartnersReq
    >({
      query: (body) => ({
        url: `/api/partner/increase_link_count`,
        method: "POST",
        body,
      }),
    }),
  }),
});
export const {
  useIncreaseLinkCountMutation,
  useIncreaseLinkCountPartnersMutation,
} = userAPI;
