import {
  Bank,
  CARD_CATEGORY_OPTIONS,
  CardCategory,
  CreditCard,
  DebitCard,
  StrapiRef,
} from "@/entities/strapi";
import { MultiSelectOption } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/cards/common/lib/card-filter.ts. */

type AnyCard = DebitCard | CreditCard;

/** Базовый набор фильтров, общий для дебетовых и кредитных карт. */
export interface BaseCardFilterState {
  banks: number[];
  features: number[];
  bonuses: number[];
  paymentSystems: number[];
  categories: CardCategory[];
  search: string;
}

export const EMPTY_BASE_CARD_FILTER: BaseCardFilterState = {
  banks: [],
  features: [],
  bonuses: [],
  paymentSystems: [],
  categories: [],
  search: "",
};

const sortByTitle = <T extends { title: string }>(items: T[]) =>
  items.sort((a, b) => a.title.localeCompare(b.title, "ru"));

export function collectCardBanks(cards: AnyCard[]): MultiSelectOption[] {
  const map = new Map<number, Bank>();
  cards.forEach((card) => card.bank && map.set(card.bank.id, card.bank));
  return sortByTitle(Array.from(map.values())).map((bank) => ({
    id: bank.id,
    title: bank.title,
    icon: bank.logo ?? undefined,
  }));
}

const collectRefs = (cards: AnyCard[], pick: (card: AnyCard) => StrapiRef[]) => {
  const map = new Map<number, StrapiRef>();
  cards.forEach((card) => pick(card).forEach((item) => map.set(item.id, item)));
  return sortByTitle(Array.from(map.values())).map<MultiSelectOption>((item) => ({
    id: item.id,
    title: item.title,
    icon: item.icon ?? undefined,
  }));
};

export const collectCardFeatures = (cards: AnyCard[]) => collectRefs(cards, (card) => card.features);
export const collectCardBonuses = (cards: AnyCard[]) => collectRefs(cards, (card) => card.bonuses);
export const collectCardPaymentSystems = (cards: AnyCard[]) =>
  collectRefs(cards, (card) => card.payment_systems);

/** Категории оставляем только те, что реально встречаются в выдаче. */
export function collectCardCategories(cards: AnyCard[]): MultiSelectOption<CardCategory>[] {
  const present = new Set(cards.map((card) => card.card_category).filter(Boolean));
  return CARD_CATEGORY_OPTIONS.filter((option) => present.has(option.id));
}

export function isBaseCardFilterActive(filter: BaseCardFilterState): boolean {
  return (
    filter.banks.length > 0 ||
    filter.features.length > 0 ||
    filter.bonuses.length > 0 ||
    filter.paymentSystems.length > 0 ||
    filter.categories.length > 0 ||
    filter.search.trim() !== ""
  );
}

/** Общая часть фильтрации: банк, особенности, бонусы, платёжная система, категория, поиск. */
export function matchesBaseCardFilter(card: AnyCard, filter: BaseCardFilterState): boolean {
  if (filter.banks.length > 0 && !(card.bank && filter.banks.includes(card.bank.id))) {
    return false;
  }

  // Особенности выбираются «и»: карта должна иметь все отмеченные.
  if (
    filter.features.length > 0 &&
    !filter.features.every((id) => card.features.some((feature) => feature.id === id))
  ) {
    return false;
  }

  if (filter.bonuses.length > 0 && !card.bonuses.some((bonus) => filter.bonuses.includes(bonus.id))) {
    return false;
  }

  if (
    filter.paymentSystems.length > 0 &&
    !card.payment_systems.some((system) => filter.paymentSystems.includes(system.id))
  ) {
    return false;
  }

  if (
    filter.categories.length > 0 &&
    !(card.card_category && filter.categories.includes(card.card_category))
  ) {
    return false;
  }

  const query = filter.search.trim().toLowerCase();
  if (query) {
    const haystack = `${card.name} ${card.bank?.title ?? ""}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  return true;
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countBaseCardFilters(filter: BaseCardFilterState): number {
  return (
    filter.banks.length +
    filter.features.length +
    filter.bonuses.length +
    filter.paymentSystems.length +
    filter.categories.length
  );
}
