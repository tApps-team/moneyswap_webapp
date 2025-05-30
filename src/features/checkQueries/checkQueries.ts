type QueryParams = {
  direction?: string | null;
  user_id?: string | null;
  user_lang?: string | null;
  tgWebAppStartParam?: string | null;
  from_site?: string | null;
};

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
  if (urlParams.has("tgWebAppStartParam")) {
    queryParams.tgWebAppStartParam = urlParams.get("tgWebAppStartParam");
  }
  if (urlParams.has("from_site")) {
    queryParams.from_site = urlParams.get("from_site");
  }

  return queryParams;
};
