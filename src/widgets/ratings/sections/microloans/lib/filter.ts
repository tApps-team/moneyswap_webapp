import {
  Microloan,
  MicroloanAmountType,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanTermType,
  MicroloanVerificationStatus,
  StrapiRef,
  compareNullable,
  getMicroloanLimitValue,
  getMicroloanRateValue,
  getMicroloanTermValue,
} from "@/entities/strapi";
import { MultiSelectOption, SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/microloans/mfo-explorer/lib/filter.ts. */

export interface MfoFilterState {
  amounts: MicroloanAmountType[];
  terms: MicroloanTermType[];
  firstLoan: MicroloanFirstLoanType[];
  verification: MicroloanVerificationStatus[];
  limitTypes: MicroloanLimitType[];
  durationTypes: MicroloanDurationType[];
  /** id каналов получения денег */
  channels: number[];
  search: string;
}

export const EMPTY_MFO_FILTER: MfoFilterState = {
  amounts: [],
  terms: [],
  firstLoan: [],
  verification: [],
  limitTypes: [],
  durationTypes: [],
  channels: [],
  search: "",
};

export type MfoSortKey = "rate" | "limit" | "term" | "rating";
export type MfoSort = SortState<MfoSortKey>;

export function collectMfoChannels(loans: Microloan[]): MultiSelectOption[] {
  const map = new Map<number, StrapiRef>();
  loans.forEach((loan) => loan.issue_channels.forEach((channel) => map.set(channel.id, channel)));
  return Array.from(map.values())
    .sort((a, b) => a.title.localeCompare(b.title, "ru"))
    .map((channel) => ({
      id: channel.id,
      title: channel.title,
      icon: channel.icon ?? undefined,
    }));
}

/** Оставляем только те значения enum-фильтра, что реально встречаются в выдаче. */
export function keepPresent<T extends string>(
  options: { id: T; title: string }[],
  present: (T | null)[],
): MultiSelectOption<T>[] {
  const set = new Set(present.filter(Boolean));
  return options.filter((option) => set.has(option.id));
}

export function isMfoFilterActive(filter: MfoFilterState): boolean {
  return (
    filter.amounts.length > 0 ||
    filter.terms.length > 0 ||
    filter.firstLoan.length > 0 ||
    filter.verification.length > 0 ||
    filter.limitTypes.length > 0 ||
    filter.durationTypes.length > 0 ||
    filter.channels.length > 0 ||
    filter.search.trim() !== ""
  );
}

/** Пустой список выбранных значений означает «фильтр не применён». */
const matchesEnum = <T extends string>(selected: T[], value: T | null): boolean =>
  selected.length === 0 || (value !== null && selected.includes(value));

export function filterMicroloans(loans: Microloan[], filter: MfoFilterState): Microloan[] {
  const query = filter.search.trim().toLowerCase();

  return loans.filter((loan) => {
    if (!matchesEnum(filter.amounts, loan.loan_amount_type)) return false;
    if (!matchesEnum(filter.terms, loan.loan_term_type)) return false;
    if (!matchesEnum(filter.firstLoan, loan.first_loan_type)) return false;
    if (!matchesEnum(filter.verification, loan.verification_status)) return false;
    if (!matchesEnum(filter.limitTypes, loan.loan_limit_type)) return false;
    if (!matchesEnum(filter.durationTypes, loan.loan_duration_type)) return false;

    if (
      filter.channels.length > 0 &&
      !loan.issue_channels.some((channel) => filter.channels.includes(channel.id))
    ) {
      return false;
    }

    if (query && !loan.name.toLowerCase().includes(query)) return false;

    return true;
  });
}

export function sortMicroloans(loans: Microloan[], sort: MfoSort | null): Microloan[] {
  if (!sort) return loans;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (loan: Microloan): number | null => {
    if (sort.key === "rate") return getMicroloanRateValue(loan);
    if (sort.key === "limit") return getMicroloanLimitValue(loan);
    if (sort.key === "term") return getMicroloanTermValue(loan);
    return loan.rating;
  };

  return [...loans].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countMfoFilters(filter: MfoFilterState): number {
  return (
    filter.amounts.length +
    filter.terms.length +
    filter.firstLoan.length +
    filter.verification.length +
    filter.limitTypes.length +
    filter.durationTypes.length +
    filter.channels.length
  );
}
