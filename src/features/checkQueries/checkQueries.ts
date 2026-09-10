type QueryParams = {
  direction?: string | null;
  user_id?: string | null;
  user_lang?: string | null;
  from_site?: string | null;
  /** Пара обмена и город из ссылки — их применяет useDeepLinkPair. */
  city?: string | null;
  give?: string | null;
  get?: string | null;
  /** Обменник и отзыв — открывают drawer с отзывами. Современный аналог from_site. */
  exchanger?: string | null;
  review?: string | null;
};

/**
 * Параметры запуска из адресной строки.
 *
 * `tgWebAppStartParam` здесь читать не нужно: его разворачивает в обычные search-параметры
 * applyStartParam() в main.tsx ещё до монтирования React, после чего сам параметр из URL удаляется.
 */
export const CheckQueries = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const queryParams: QueryParams = {};

  // Добавляем ключи и значения только для существующих параметров запроса
  if (urlParams.has("direction")) {
    queryParams.direction = urlParams.get("direction");
  }
  if (urlParams.has("user_id")) {
    queryParams.user_id = urlParams.get("user_id");
  }
  if (urlParams.has("user_lang")) {
    queryParams.user_lang = urlParams.get("user_lang");
  }
  if (urlParams.has("from_site")) {
    queryParams.from_site = urlParams.get("from_site");
  }
  if (urlParams.has("city")) {
    queryParams.city = urlParams.get("city");
  }
  if (urlParams.has("give")) {
    queryParams.give = urlParams.get("give");
  }
  if (urlParams.has("get")) {
    queryParams.get = urlParams.get("get");
  }
  if (urlParams.has("exchanger")) {
    queryParams.exchanger = urlParams.get("exchanger");
  }
  if (urlParams.has("review")) {
    queryParams.review = urlParams.get("review");
  }

  return queryParams;
};
