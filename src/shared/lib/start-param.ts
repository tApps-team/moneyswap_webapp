/**
 * Разбор параметра `startapp` из внешней ссылки на мини-апп.
 *
 * Публичная ссылка вида `https://t.me/<bot>/<app>?startapp=<value>` умеет передать ровно одно
 * значение. Telegram кладёт его сразу в два места: в GET-параметр `tgWebAppStartParam` и в
 * `initDataUnsafe.start_param` — читаем оба, потому что на части клиентов приезжает только одно.
 *
 * Ограничения значения: до 512 символов, алфавит только `A-Z a-z 0-9 _ -`. Символа `=` в нём нет,
 * поэтому положить туда готовую query-строку нельзя — отсюда формат ниже.
 *
 * Формат: пары разделены `__`, ключ отделён от значения ПЕРВЫМ дефисом.
 *   tab-ratings__section-payment-services__item-yoomarket
 *     -> ?tab=ratings&section=payment-services&item=yoomarket
 *
 * Плюс два сокращения для ссылок, которые собирают руками:
 *   ratings | blacklist | more   -> ?tab=<значение>
 *   microloans | esim | ved | …  -> ?tab=ratings&section=<значение>
 */
import { RATING_SECTION_KEYS } from "@/shared/config/rating-sections";
import { appTabs } from "@/shared/routing/paths";

/** GET-параметр, в котором Telegram отдаёт значение `startapp`. */
export const TG_START_PARAM = "tgWebAppStartParam";

/**
 * Ключи, которые разрешено выставлять из внешней ссылки.
 * Кроме навигации сюда входят параметры экрана обмена: иначе публичной ссылкой нельзя открыть
 * ни направление, ни отзыв — эти сценарии сейчас доступны только боту через прямой URL webapp.
 */
export const START_PARAM_KEYS = [
  "tab",
  "section",
  "item",
  "direction",
  "user_lang",
  "user_id",
  "from_site",
] as const;

export type StartParamKey = (typeof START_PARAM_KEYS)[number];

const TAB_VALUES: string[] = Object.values(appTabs);
const SECTION_VALUES: string[] = RATING_SECTION_KEYS;

const PAIR_SEPARATOR = "__";

/** Чанк начинает новую пару, только если это `<известный ключ>-…`. */
const startsNewPair = (chunk: string) =>
  START_PARAM_KEYS.some((key) => chunk.startsWith(`${key}-`));

/**
 * Разворачивает значение `startapp` в набор search-параметров.
 * Неизвестные ключи и мусор молча отбрасываются — внешняя ссылка не должна ломать загрузку.
 */
export const parseStartParam = (raw: string | null | undefined): Partial<Record<StartParamKey, string>> => {
  const value = raw?.trim();
  if (!value) return {};

  // Сокращения: голое имя вкладки или раздела.
  if (TAB_VALUES.includes(value)) return { tab: value };
  if (SECTION_VALUES.includes(value)) return { tab: appTabs.ratings, section: value };

  const result: Partial<Record<StartParamKey, string>> = {};
  let lastKey: StartParamKey | null = null;

  value.split(PAIR_SEPARATOR).forEach((chunk) => {
    if (!startsNewPair(chunk)) {
      // Значение само содержало `__` (например from_site-153__2914) — склеиваем обратно.
      if (lastKey) result[lastKey] = `${result[lastKey]}${PAIR_SEPARATOR}${chunk}`;
      return;
    }

    const separatorIndex = chunk.indexOf("-");
    const key = chunk.slice(0, separatorIndex) as StartParamKey;
    const chunkValue = chunk.slice(separatorIndex + 1);

    if (!chunkValue) {
      lastKey = null;
      return;
    }

    result[key] = chunkValue;
    lastKey = key;
  });

  return result;
};

/** Обратная сборка — для кнопки «Поделиться». */
export const buildStartParam = (params: Partial<Record<StartParamKey, string | null>>): string =>
  START_PARAM_KEYS.filter((key) => params[key]).map((key) => `${key}-${params[key]}`).join(
    PAIR_SEPARATOR,
  );

/** Значение `startapp`: сначала GET-параметр, затем initData — приезжает не везде одинаково. */
export const readStartParam = (): string | null => {
  const fromQuery = new URLSearchParams(window.location.search).get(TG_START_PARAM);
  if (fromQuery) return fromQuery;

  return window.Telegram?.WebApp?.initDataUnsafe?.start_param ?? null;
};

/**
 * Переписывает адресную строку до монтирования React.
 *
 * Вся навигация приложения читается из search-параметров, поэтому нормализация URL на старте
 * избавляет от правок в роутере и экранах: React сразу видит финальный адрес — без мигания
 * вкладки «Обмен» и без гонки с ленивыми чанками вкладок.
 */
export const applyStartParam = (): void => {
  try {
    const raw = readStartParam();
    const parsed = parseStartParam(raw);
    const search = new URLSearchParams(window.location.search);
    const hadTgParam = search.has(TG_START_PARAM);

    if (!hadTgParam && !Object.keys(parsed).length) return;

    // Своё значение уже отработало — иначе оно переигрывало бы дальнейшую навигацию.
    search.delete(TG_START_PARAM);
    // При конфликте значение из ссылки побеждает: пользователь пришёл именно за ним.
    Object.entries(parsed).forEach(([key, value]) => search.set(key, value));

    const query = search.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  } catch {
    // Битая ссылка не должна мешать приложению открыться.
  }
};
