import {
  Bank,
  BankCredit,
  CreditTermBucket,
  compareNullable,
  getCreditAmountValue,
  getCreditRateValue,
  getCreditTermValue,
  matchesCreditTerm,
} from "@/entities/strapi";
import { MultiSelectOption, SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/credits/credits-explorer/lib/filter.ts. */

export interface CreditsFilterState {
  banks: number[];
  terms: CreditTermBucket[];
  /** Минимальная нужная сумма кредита (сырой ввод из инпута). */
  minAmount: string;
  search: string;
}

export const EMPTY_CREDITS_FILTER: CreditsFilterState = {
  banks: [],
  terms: [],
  minAmount: "",
  search: "",
};

export type CreditsSortKey = "rate" | "amount" | "term" | "rating";
export type CreditsSort = SortState<CreditsSortKey>;

export function collectCreditBanks(credits: BankCredit[]): MultiSelectOption[] {
  const map = new Map<number, Bank>();
  credits.forEach((credit) => credit.bank && map.set(credit.bank.id, credit.bank));
  return Array.from(map.values())
    .sort((a, b) => a.title.localeCompare(b.title, "ru"))
    .map((bank) => ({ id: bank.id, title: bank.title, icon: bank.logo ?? undefined }));
}

/** Разбирает ввод суммы, оставляя только цифры. */
export function parseAmountInput(value: string): number | null {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : null;
}

export function isCreditsFilterActive(filter: CreditsFilterState): boolean {
  return (
    filter.banks.length > 0 ||
    filter.terms.length > 0 ||
    filter.minAmount.trim() !== "" ||
    filter.search.trim() !== ""
  );
}

export function filterCredits(credits: BankCredit[], filter: CreditsFilterState): BankCredit[] {
  const minAmount = parseAmountInput(filter.minAmount);
  const query = filter.search.trim().toLowerCase();

  return credits.filter((credit) => {
    if (filter.banks.length > 0 && !(credit.bank && filter.banks.includes(credit.bank.id))) {
      return false;
    }

    if (!matchesCreditTerm(credit, filter.terms)) {
      return false;
    }

    // Нужная сумма должна укладываться в максимум по продукту.
    if (minAmount != null) {
      const max = getCreditAmountValue(credit);
      if (max == null || max < minAmount) return false;
    }

    if (query) {
      const haystack = `${credit.name} ${credit.bank?.title ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function sortCredits(credits: BankCredit[], sort: CreditsSort | null): BankCredit[] {
  if (!sort) return credits;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (credit: BankCredit): number | null => {
    if (sort.key === "rate") return getCreditRateValue(credit);
    if (sort.key === "amount") return getCreditAmountValue(credit);
    if (sort.key === "term") return getCreditTermValue(credit);
    return credit.rating;
  };

  return [...credits].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countCreditsFilters(filter: CreditsFilterState): number {
  return filter.banks.length + filter.terms.length + (filter.minAmount.trim() ? 1 : 0);
}
