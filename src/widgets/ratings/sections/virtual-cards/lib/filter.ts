import { StrapiRef, VirtualCard } from "@/entities/strapi";
import { SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/vc/vc-explorer/lib/filter.ts. */

export interface VcFilterState {
  /** id выбранных сервисов (платформ) */
  platforms: number[];
  /** поиск по названию карты */
  search: string;
}

export const EMPTY_VC_FILTER: VcFilterState = {
  platforms: [],
  search: "",
};

/** Уникальные сервисы (платформы) из всех карт, отсортированные по названию. */
export function collectVcPlatforms(cards: VirtualCard[]): StrapiRef[] {
  const map = new Map<number, StrapiRef>();
  cards.forEach((card) => card.platforms.forEach((p) => map.set(p.id, p)));
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function isVcFilterActive(filter: VcFilterState): boolean {
  return filter.platforms.length > 0 || filter.search.trim() !== "";
}

export function countVcFilters(filter: VcFilterState): number {
  return filter.platforms.length;
}

export type VcSortKey = "issuance" | "topup";
export type VcSort = SortState<VcSortKey>;

/** Извлекает первое число из строки («От 3%» → 3, «Бесплатно» → null). */
function parseNumeric(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const numeric = Number(match[0]);
  return Number.isFinite(numeric) ? numeric : null;
}

/** Сортирует карты по выбранной колонке. null-значения всегда в конце. */
export function sortVirtualCards(cards: VirtualCard[], sort: VcSort | null): VirtualCard[] {
  if (!sort) return cards;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (card: VirtualCard): number | null =>
    sort.key === "issuance" ? card.issuance_cost : parseNumeric(card.topup_commission);

  // Array.prototype.sort стабилен — при равных значениях порядок из API сохраняется.
  return [...cards].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return (va - vb) * factor;
  });
}

export function filterVirtualCards(cards: VirtualCard[], filter: VcFilterState): VirtualCard[] {
  const query = filter.search.trim().toLowerCase();

  return cards.filter((card) => {
    if (
      filter.platforms.length > 0 &&
      !card.platforms.some((p) => filter.platforms.includes(p.id))
    ) {
      return false;
    }

    if (query && !card.name.toLowerCase().includes(query)) {
      return false;
    }

    return true;
  });
}
