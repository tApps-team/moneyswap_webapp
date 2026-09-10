import {
  CreditCard,
  GracePeriodBucket,
  compareNullable,
  getCardRateValue,
  getCreditLimitValue,
  getServiceCostValue,
  matchesGracePeriod,
} from "@/entities/strapi";
import { SortState } from "@/shared/ui/ratings";
import {
  BaseCardFilterState,
  EMPTY_BASE_CARD_FILTER,
  countBaseCardFilters,
  isBaseCardFilterActive,
  matchesBaseCardFilter,
} from "../../cards/lib/cardFilter";

/** Порт moneyswap_next/src/widgets/cards/credit-cards-explorer/lib/filter.ts. */

export interface CreditCardFilterState extends BaseCardFilterState {
  /** Пороговые группы льготного периода: 30/60/90/120/180 дней. */
  gracePeriods: GracePeriodBucket[];
}

export const EMPTY_CREDIT_CARD_FILTER: CreditCardFilterState = {
  ...EMPTY_BASE_CARD_FILTER,
  gracePeriods: [],
};

export type CreditCardSortKey = "grace" | "limit" | "rate" | "service" | "rating";
export type CreditCardSort = SortState<CreditCardSortKey>;

export function isCreditCardFilterActive(filter: CreditCardFilterState): boolean {
  return isBaseCardFilterActive(filter) || filter.gracePeriods.length > 0;
}

export function filterCreditCards(
  cards: CreditCard[],
  filter: CreditCardFilterState,
): CreditCard[] {
  return cards.filter(
    (card) => matchesBaseCardFilter(card, filter) && matchesGracePeriod(card, filter.gracePeriods),
  );
}

export function sortCreditCards(cards: CreditCard[], sort: CreditCardSort | null): CreditCard[] {
  if (!sort) return cards;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (card: CreditCard): number | null => {
    if (sort.key === "grace") return card.grace_period_days;
    if (sort.key === "limit") return getCreditLimitValue(card);
    if (sort.key === "rate") return getCardRateValue(card);
    if (sort.key === "service") return getServiceCostValue(card);
    return card.rating;
  };

  return [...cards].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

export function countCreditCardFilters(filter: CreditCardFilterState): number {
  return countBaseCardFilters(filter) + filter.gracePeriods.length;
}
