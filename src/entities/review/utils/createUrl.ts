import { ReviewsByExchangeDtoRequest } from "../api/reviewDto";

export const createUrl = (data: ReviewsByExchangeDtoRequest) => {
  const { element_on_page, exchange_name, grade_filter, page } =
    data;
  if (element_on_page && !grade_filter) {
    return `api/reviews/reviews_by_exchange?exchange_name=${exchange_name}&page=${page}&element_on_page=${element_on_page}`;
  }
  if (grade_filter && !element_on_page) {
    return `api/reviews/reviews_by_exchange?exchange_name=${exchange_name}&page=${page}&grade_filter=${grade_filter}`;
  }
  if (grade_filter && element_on_page) {
    return `api/reviews/reviews_by_exchange?exchange_name=${exchange_name}&page=${page}&element_on_page=${element_on_page}&grade_filter=${grade_filter}`;
  }
  return `api/reviews/reviews_by_exchange?exchange_name=${exchange_name}&page=${page}`;
};
