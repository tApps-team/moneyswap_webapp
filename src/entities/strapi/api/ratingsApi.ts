import { strapiApi } from "@/shared/api";
import { RATING_SECTION, STRAPI_FAQ, STRAPI_SECTION_PAGE } from "@/shared/api/tags";
import {
  SectionPage,
  StrapiListResponse,
  StrapiSingleResponse,
} from "../model/content";
import {
  BankCredit,
  CreditCard,
  DebitCard,
  Esim,
  FaqItem,
  MarketType,
  Microloan,
  PaymentService,
  VedAgent,
  VirtualCard,
} from "../model/ratings";
import { RatingSectionKey } from "@/shared/config";

/**
 * Списки во всех разделах маленькие (7–14 записей), поэтому забираем раздел одним
 * запросом и фильтруем/сортируем на клиенте — ровно как на сайте.
 * VIP-предложения всегда идут первыми: порядок задаёт сам Strapi.
 */
const LIST_QUERY = "sort[0]=is_vip:desc&sort[1]=publishedAt:asc&pagination[pageSize]=100";

/** Контроллеры Strapi отдают уже плоские объекты, поэтому достаточно взять `data`. */
const takeList = <T>(response: StrapiListResponse<T>): T[] => response?.data ?? [];

/** single type страницы раздела: из него берём заголовок и вводный текст. */
const SECTION_PAGE_ENDPOINT: Record<RatingSectionKey, string> = {
  ved: "ved-page",
  "virtual-cards": "vc-page",
  esim: "esim-page",
  "payment-services": "payment-service-page",
  "debit-cards": "debit-card-page",
  "credit-cards": "credit-card-page",
  credits: "bank-credit-page",
  microloans: "microloan-page",
};

export const ratingsApi = strapiApi.injectEndpoints({
  endpoints: (build) => ({
    /* --- страницы разделов (заголовок + вводный текст) --- */
    getSectionPage: build.query<SectionPage | null, RatingSectionKey>({
      query: (section) => SECTION_PAGE_ENDPOINT[section],
      transformResponse: (response: StrapiSingleResponse<SectionPage>) => response?.data ?? null,
      providesTags: (_result, _error, section) => [{ type: STRAPI_SECTION_PAGE, id: section }],
    }),

    /* --- списки разделов --- */
    getVedAgents: build.query<VedAgent[], void>({
      query: () => `ved-agents?${LIST_QUERY}`,
      transformResponse: takeList<VedAgent>,
      providesTags: [{ type: RATING_SECTION, id: "ved" }],
    }),

    getVirtualCards: build.query<VirtualCard[], MarketType>({
      query: (marketType) => `virtual-cards?filters[market_type][$eq]=${marketType}&${LIST_QUERY}`,
      transformResponse: takeList<VirtualCard>,
      providesTags: (_r, _e, marketType) => [
        { type: RATING_SECTION, id: `virtual-cards-${marketType}` },
      ],
    }),

    getEsims: build.query<Esim[], MarketType>({
      query: (marketType) => `e-sims?filters[market_type][$eq]=${marketType}&${LIST_QUERY}`,
      transformResponse: takeList<Esim>,
      providesTags: (_r, _e, marketType) => [{ type: RATING_SECTION, id: `esim-${marketType}` }],
    }),

    getPaymentServices: build.query<PaymentService[], void>({
      query: () => `payment-services?${LIST_QUERY}`,
      transformResponse: takeList<PaymentService>,
      providesTags: [{ type: RATING_SECTION, id: "payment-services" }],
    }),

    getDebitCards: build.query<DebitCard[], void>({
      query: () => `debit-cards?${LIST_QUERY}`,
      transformResponse: takeList<DebitCard>,
      providesTags: [{ type: RATING_SECTION, id: "debit-cards" }],
    }),

    getCreditCards: build.query<CreditCard[], void>({
      query: () => `credit-cards?${LIST_QUERY}`,
      transformResponse: takeList<CreditCard>,
      providesTags: [{ type: RATING_SECTION, id: "credit-cards" }],
    }),

    getBankCredits: build.query<BankCredit[], void>({
      query: () => `bank-credits?${LIST_QUERY}`,
      transformResponse: takeList<BankCredit>,
      providesTags: [{ type: RATING_SECTION, id: "credits" }],
    }),

    getMicroloans: build.query<Microloan[], void>({
      query: () => `microloans?${LIST_QUERY}`,
      transformResponse: takeList<Microloan>,
      providesTags: [{ type: RATING_SECTION, id: "microloans" }],
    }),

    /* --- FAQ для вкладки «Ещё» --- */
    getFaq: build.query<FaqItem[], void>({
      query: () => "main-faqs?sort[0]=id:asc&pagination[pageSize]=200",
      transformResponse: takeList<FaqItem>,
      providesTags: [STRAPI_FAQ],
    }),
  }),
});

export const {
  useGetSectionPageQuery,
  useGetVedAgentsQuery,
  useGetVirtualCardsQuery,
  useGetEsimsQuery,
  useGetPaymentServicesQuery,
  useGetDebitCardsQuery,
  useGetCreditCardsQuery,
  useGetBankCreditsQuery,
  useGetMicroloansQuery,
  useGetFaqQuery,
} = ratingsApi;
