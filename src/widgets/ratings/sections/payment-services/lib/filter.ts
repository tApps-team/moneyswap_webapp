import {
  PaymentService,
  PaymentServicePlatform,
  StrapiRef,
  compareNullable,
  getCommissionValue,
} from "@/entities/strapi";
import { MultiSelectOption, SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/payment-services/ps-explorer/lib/filter.ts. */

export interface PsFilterState {
  /** id платформ: сервисы и игры в одном списке */
  platforms: number[];
  /** id способов оплаты */
  paymentSystems: number[];
  /** id стран (регионов аккаунта) */
  countries: number[];
  /** поиск по названию */
  search: string;
}

export const EMPTY_PS_FILTER: PsFilterState = {
  platforms: [],
  paymentSystems: [],
  countries: [],
  search: "",
};

export type PsSortKey = "commission" | "rating";
export type PsSort = SortState<PsSortKey>;

export const collectPsPlatforms = (services: PaymentService[]) => {
  const map = new Map<number, PaymentServicePlatform>();
  services.forEach((service) =>
    service.platforms.forEach((platform) => map.set(platform.id, platform)),
  );
  return Array.from(map.values())
    .sort((a, b) => a.title.localeCompare(b.title, "ru"))
    .map<MultiSelectOption>((platform) => ({
      id: platform.id,
      title: platform.title,
      icon: platform.icon ?? undefined,
    }));
};

export const collectPsPaymentSystems = (services: PaymentService[]) => {
  const map = new Map<number, StrapiRef>();
  services.forEach((service) =>
    service.payment_systems.forEach((method) => map.set(method.id, method)),
  );
  return Array.from(map.values())
    .sort((a, b) => a.title.localeCompare(b.title, "ru"))
    .map<MultiSelectOption>((method) => ({
      id: method.id,
      title: method.title,
      icon: method.icon ?? undefined,
    }));
};

/** Уникальные страны из всех сервисов, отсортированные по названию. */
export const collectPsCountries = (services: PaymentService[]): StrapiRef[] => {
  const map = new Map<number, StrapiRef>();
  services.forEach((service) =>
    (service.countries ?? []).forEach((country) => map.set(country.id, country)),
  );
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "ru"));
};

export function isPsFilterActive(filter: PsFilterState): boolean {
  return (
    filter.platforms.length > 0 ||
    filter.paymentSystems.length > 0 ||
    filter.countries.length > 0 ||
    filter.search.trim() !== ""
  );
}

export function filterPaymentServices(
  services: PaymentService[],
  filter: PsFilterState,
): PaymentService[] {
  const query = filter.search.trim().toLowerCase();

  return services.filter((service) => {
    const platformIds = service.platforms.map((platform) => platform.id);

    if (filter.platforms.length > 0 && !filter.platforms.every((id) => platformIds.includes(id))) {
      return false;
    }

    if (
      filter.paymentSystems.length > 0 &&
      !service.payment_systems.some((method) => filter.paymentSystems.includes(method.id))
    ) {
      return false;
    }

    if (
      filter.countries.length > 0 &&
      !(service.countries ?? []).some((country) => filter.countries.includes(country.id))
    ) {
      return false;
    }

    if (query && !service.name.toLowerCase().includes(query)) {
      return false;
    }

    return true;
  });
}

export function sortPaymentServices(
  services: PaymentService[],
  sort: PsSort | null,
): PaymentService[] {
  if (!sort) return services;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (service: PaymentService): number | null =>
    sort.key === "commission" ? getCommissionValue(service) : service.rating;

  // Array.prototype.sort стабилен — при равных значениях сохраняется порядок из API.
  return [...services].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countPsFilters(filter: PsFilterState): number {
  return filter.platforms.length + filter.paymentSystems.length + filter.countries.length;
}
