import {
  DebitCard,
  compareNullable,
  getCashbackValue,
  getPercentOnBalanceValue,
  getServiceCostValue,
} from "@/entities/strapi";
import { SortState } from "@/shared/ui/ratings";
import {
  BaseCardFilterState,
  EMPTY_BASE_CARD_FILTER,
  countBaseCardFilters,
  isBaseCardFilterActive,
  matchesBaseCardFilter,
} from "../../cards/lib/cardFilter";

/** Порт moneyswap_next/src/widgets/cards/debit-cards-explorer/lib/filter.ts. */

export type DebitCardFilterState = BaseCardFilterState;

export const EMPTY_DEBIT_CARD_FILTER: DebitCardFilterState = { ...EMPTY_BASE_CARD_FILTER };

export type DebitCardSortKey = "cashback" | "percent" | "service" | "rating";
export type DebitCardSort = SortState<DebitCardSortKey>;

export const isDebitCardFilterActive = isBaseCardFilterActive;

export function filterDebitCards(cards: DebitCard[], filter: DebitCardFilterState): DebitCard[] {
  return cards.filter((card) => matchesBaseCardFilter(card, filter));
}

export function sortDebitCards(cards: DebitCard[], sort: DebitCardSort | null): DebitCard[] {
  if (!sort) return cards;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (card: DebitCard): number | null => {
    if (sort.key === "cashback") return getCashbackValue(card);
    if (sort.key === "percent") return getPercentOnBalanceValue(card);
    if (sort.key === "service") return getServiceCostValue(card);
    return card.rating;
  };

  return [...cards].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

export const countDebitCardFilters = countBaseCardFilters;
