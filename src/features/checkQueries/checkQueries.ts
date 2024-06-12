type QueryParams = {
  direction?: string | null;
  user_id?: string | null;
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

  return queryParams;
};
