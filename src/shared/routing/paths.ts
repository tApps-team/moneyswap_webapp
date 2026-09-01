export enum paths {
  main = "/",
  notFound = "*",
}

/**
 * Вкладки нижнего меню.
 *
 * Навигация живёт в query-параметрах, а не в путях: мини-апп раздаётся статикой,
 * SPA-fallback на произвольный путь не гарантирован, а бот уже депит-линкует
 * приложение именно через query (`from_site`, `direction`, `user_lang`).
 */
export enum appTabs {
  exchange = "exchange",
  ratings = "ratings",
  blacklist = "blacklist",
  more = "more",
}

/** Имена search-параметров навигации. */
export const navQuery = {
  tab: "tab",
  section: "section",
  item: "item",
} as const;

export const isAppTab = (value: string | null | undefined): value is appTabs =>
  !!value && Object.values(appTabs).includes(value as appTabs);
