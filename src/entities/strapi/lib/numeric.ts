/**
 * Разбор числовых значений из строковых полей Strapi.
 * Условия банков и МФО хранятся человекочитаемым текстом («до 16.5%», «50 000 – 5 000 000 ₽»),
 * а для сортировок и фильтров нужны числа.
 *
 * Порт moneyswap_next/src/entities/strapi/lib/numeric.ts — менять нельзя,
 * иначе выдача в мини-аппе разойдётся с сайтом.
 */

/** Первое число в строке: «до 500 000 ₽/мес» → 500000, «22,9–42,1%» → 22.9. */
export function parseNumeric(value: string | number | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const match = String(value)
    .replace(/ | /g, " ")
    .match(/\d[\d\s]*(?:[.,]\d+)?/);
  if (!match) return null;

  const numeric = Number(match[0].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(numeric) ? numeric : null;
}

/** Последнее число в строке: «50 000 – 5 000 000 ₽» → 5000000. */
export function parseLastNumeric(value: string | number | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const matches = String(value)
    .replace(/ | /g, " ")
    .match(/\d[\d\s]*(?:[.,]\d+)?/g);
  if (!matches?.length) return null;

  const numeric = Number(matches[matches.length - 1].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(numeric) ? numeric : null;
}

/** biginteger приходит из Strapi строкой — приводим к числу. */
export function parseBigInteger(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

/** 5000000 → «5 000 000 ₽». */
export function formatMoney(value: string | number | null | undefined): string {
  const numeric = parseBigInteger(value);
  if (numeric === null) return "—";
  return `${numeric.toLocaleString("ru-RU")} ₽`;
}

/** Значение или прочерк, чтобы в карточках не было пустых мест. */
export function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const text = String(value).trim();
  return text === "" ? "—" : text;
}

/**
 * Компаратор для сортировок: null-значения всегда уходят в конец,
 * независимо от направления сортировки.
 */
export function compareNullable(a: number | null, b: number | null, factor: number): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a === b) return 0;
  return a < b ? -factor : factor;
}

/** Убирает HTML-теги из текста Strapi. */
export function stripHtmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
