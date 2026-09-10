/**
 * Сборка и отправка ссылки на конкретный экран мини-аппа.
 *
 * Обратная операция к start-param.ts: состояние приложения упаковывается в `startapp`,
 * из которого получается публичная ссылка `https://t.me/<bot>/<app>?startapp=…`.
 */
import { StartParamKey, buildStartParam } from "./start-param";
import { openExternalLink } from "./open-link";

/**
 * Базовый адрес мини-аппа. Без него кнопку «Поделиться» не показываем: лучше её отсутствие,
 * чем ссылка на чужого (тестового) бота в проде.
 */
export const MINI_APP_URL: string = import.meta.env.VITE_TG_MINIAPP_URL || "";

export const isShareAvailable = () => Boolean(MINI_APP_URL);

/** Ссылка на мини-апп с нужным состоянием. Пустой набор параметров даёт ссылку на главный экран. */
export const buildMiniAppLink = (
  params: Partial<Record<StartParamKey, string | null>>,
): string | null => {
  if (!MINI_APP_URL) return null;

  const startParam = buildStartParam(params);
  return startParam ? `${MINI_APP_URL}?startapp=${startParam}` : MINI_APP_URL;
};

/**
 * Отдаёт ссылку в нативный диалог пересылки Telegram.
 * Вне Telegram копируем в буфер обмена — там `t.me/share/url` открыл бы лишнюю вкладку.
 */
export const shareLink = (url: string, text?: string) => {
  const tg = window?.Telegram?.WebApp;

  if (tg) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}${
      text ? `&text=${encodeURIComponent(text)}` : ""
    }`;
    openExternalLink(shareUrl);
    return;
  }

  navigator.clipboard?.writeText(url).catch(() => {
    window.prompt("", url);
  });
};
