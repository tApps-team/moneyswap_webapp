import { StrapiCurrency, StrapiRef, VedAgent } from "@/entities/strapi";
import { SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/ved/ved-agents-explorer/lib/filter.ts. */

export interface VedFilterState {
  /** id выбранных стран получателя */
  countries: number[];
  /** id выбранных валют платежа */
  currencies: number[];
  /** сумма перевода (сырой ввод пользователя) */
  amount: string;
}

export const EMPTY_VED_FILTER: VedFilterState = {
  countries: [],
  currencies: [],
  amount: "",
};

/** Парсит сумму из инпута (оставляя только цифры). */
export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : null;
}

/** Парсит лимит агента («1 000», «1000») в число. */
function parseLimit(value: string | null): number | null {
  if (value == null || value === "") return null;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export type VedSortKey = "commission" | "limitFrom";
export type VedSort = SortState<VedSortKey>;

/** Сортирует агентов по выбранной колонке. null-значения всегда в конце. */
export function sortVedAgents(agents: VedAgent[], sort: VedSort | null): VedAgent[] {
  if (!sort) return agents;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (agent: VedAgent): number | null =>
    sort.key === "commission" ? agent.commission : parseLimit(agent.limits.from);

  // Array.prototype.sort стабилен — при равных значениях порядок из API сохраняется.
  return [...agents].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return (va - vb) * factor;
  });
}

/** Уникальные страны из всех агентов, отсортированные по названию. */
export function collectCountries(agents: VedAgent[]): StrapiRef[] {
  const map = new Map<number, StrapiRef>();
  agents.forEach((agent) => agent.countries.forEach((c) => map.set(c.id, c)));
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

/** Уникальные валюты из всех агентов, отсортированные по названию. */
export function collectCurrencies(agents: VedAgent[]): StrapiCurrency[] {
  const map = new Map<number, StrapiCurrency>();
  agents.forEach((agent) => agent.currencies.forEach((c) => map.set(c.id, c)));
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function isVedFilterActive(filter: VedFilterState): boolean {
  return filter.countries.length > 0 || filter.currencies.length > 0 || filter.amount.trim() !== "";
}

export function countVedFilters(filter: VedFilterState): number {
  return filter.countries.length + filter.currencies.length + (filter.amount.trim() ? 1 : 0);
}

export function filterVedAgents(agents: VedAgent[], filter: VedFilterState): VedAgent[] {
  const amount = parseAmount(filter.amount);

  return agents.filter((agent) => {
    if (
      filter.countries.length > 0 &&
      !agent.countries.some((c) => filter.countries.includes(c.id))
    ) {
      return false;
    }

    if (
      filter.currencies.length > 0 &&
      !agent.currencies.some((c) => filter.currencies.includes(c.id))
    ) {
      return false;
    }

    if (amount != null) {
      const from = parseLimit(agent.limits.from);
      const to = parseLimit(agent.limits.to);
      // Оставляем агента, только если сумма попадает в его диапазон.
      // null-границы считаем безграничными.
      if (from != null && amount < from) return false;
      if (to != null && amount > to) return false;
    }

    return true;
  });
}
