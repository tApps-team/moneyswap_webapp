/**
 * Открытие внешней ссылки из мини-аппа.
 *
 * Обычный переход по <a> внутри Telegram WebView уводит пользователя из приложения,
 * поэтому все внешние ссылки (сайты агентов, промокоды, ссылки внутри контента Strapi)
 * идут через методы Telegram. Логика повторяет reviewDrawer.tsx.
 */
export const openExternalLink = (url?: string | null) => {
  if (!url) return;

  const tg = window?.Telegram?.WebApp;

  if (!tg) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const isTelegramLink = /^https?:\/\/(t\.me|telegram\.me)\//i.test(url);

  try {
    if (isTelegramLink) {
      tg.openTelegramLink(url);
    } else {
      tg.openLink(url, [{ try_instant_view: true }]);
    }
  } catch {
    try {
      tg.openLink(url, [{ try_instant_view: true }]);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
};
