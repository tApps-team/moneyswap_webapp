// Объявляем глобально ym, чтобы TS не ругался
declare global {
    interface Window {
      ym?: (id: number, type: string, goal: string) => void;
    }
  }
  
  // Все цели как константы
  export const YandexGoals = {
    SELECT_TYPE_CASHLESS: "select_type_cashless",
    SELECT_TYPE_CASH: "select_type_cash",
    CASHLESS_GIVE: "cashless_give",
    CASHLESS_RECEIVE: "cashless_receive",
    CASH_COUNTRY_SELECT: "cash_country_select",
    CASH_GIVE: "cash_give",
    CASH_RECEIVE: "cash_receive",
    EXCHANGE_REDIRECT: "exchange_redirect",
    REVIEWS_OPEN: "reviews_open",
    REVIEW_ADD: "review_add",
  } as const;
  
  // Чтобы TS понимал, что ключи — это конкретные строки
  export type YandexGoalKey = keyof typeof YandexGoals;
  
  // Обёртка для вызова цели
  export const reachGoal = (goal: typeof YandexGoals[YandexGoalKey]) => {
    if (typeof window !== "undefined" && window.ym) {
      window.ym(103663306, "reachGoal", goal);
      console.log(`[Analytics] Event sent: ${goal}`);
    }
  };
  