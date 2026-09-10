import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RATING_SECTION, STRAPI_FAQ, STRAPI_SECTION_PAGE } from "./tags";

/**
 * Отдельный api-слайс для Strapi.
 *
 * Нельзя переиспользовать baseApi: он вешает заголовок `Moneyswap: true` на все запросы,
 * а кастомный заголовок к чужому домену вызывает CORS-preflight. Здесь запросы простые (GET
 * без заголовков), поэтому preflight не нужен.
 */
/**
 * .env не хранится в репозитории, поэтому подстраховываемся продовым адресом:
 * без него весь раздел рейтингов молча ушёл бы в ошибки после деплоя.
 */
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://strp.moneyswap.online";

export const strapiApi = createApi({
  reducerPath: "strapiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${STRAPI_URL}/api`,
  }),
  endpoints: () => ({}),
  tagTypes: [RATING_SECTION, STRAPI_SECTION_PAGE, STRAPI_FAQ],
});
