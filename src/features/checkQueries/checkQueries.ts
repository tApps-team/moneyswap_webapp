type QueryParams = {
  direction?: string | null;
  user_id?: string | null;
  user_lang?: string | null;
  from_site?: string | null;
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

  return queryParams;
};
