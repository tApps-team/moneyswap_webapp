type QueryParams = {
  direction?: string | null;
};

export const CheckQueries = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const queryParams: QueryParams = {};

  // Добавляем ключи и значения только для существующих параметров запроса
  if (urlParams.has("direction")) {
    queryParams.direction = urlParams.get("direction");
  }

  return queryParams;
};
