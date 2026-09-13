import { RatingSectionKey } from "@/shared/config";

/** Параметры визита: произвольное дерево, которое Метрика показывает в отчётах. */
type YmParams = Record<string, unknown>;

// Объявляем глобально ym, чтобы TS не ругался
declare global {
  interface Window {
    ym?: (id: number, type: string, goal: string, params?: YmParams) => void;
  }
}

const COUNTER_ID = 103663306;

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
  /** Одна цель на все рейтинги: разрез по сервисам и агентам лежит в параметрах. */
  RATING: "rating_app",
} as const;

// Чтобы TS понимал, что ключи — это конкретные строки
export type YandexGoalKey = keyof typeof YandexGoals;

/** Что именно сделал посетитель: открыл карточку агента или ушёл на его сайт. */
export type AgentGoalType = "agent_page" | "agent_site";

// Обёртка для вызова цели
export const reachGoal = (goal: (typeof YandexGoals)[YandexGoalKey], params?: YmParams) => {
  if (typeof window !== "undefined" && window.ym) {
    window.ym(COUNTER_ID, "reachGoal", goal, params);
    console.log(`[Analytics] Event sent: ${goal}`, params ?? "");
  }
};

/**
 * Цель по агенту рейтинга.
 *
 * Параметры передаются деревом «сервис → действие → слаг», а не тремя плоскими
 * ключами: в отчёте «Параметры визитов» дерево разворачивается по уровням, и
 * видно, сколько открытий и переходов дал каждый раздел. С плоскими ключами
 * такой разрез пришлось бы собирать сегментами.
 */
export const reachRatingAgentGoal = (
  serviceType: RatingSectionKey,
  goalType: AgentGoalType,
  slug: string,
) =>
  reachGoal(YandexGoals.RATING, {
    rating: {
      [serviceType]: {
        [goalType]: slug,
      },
    },
  });
