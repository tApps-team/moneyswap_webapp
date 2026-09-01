import {
  PaymentService,
  PaymentServicePlatform,
  StrapiCurrency,
  StrapiRef,
  compareNullable,
  getCommissionValue,
} from "@/entities/strapi";
import { MultiSelectOption, SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/payment-services/ps-explorer/lib/filter.ts. */

export interface PsFilterState {
  /** id сервисов (kind !== "game") */
  services: number[];
  /** id игр (kind === "game") */
  games: number[];
  /** id способов оплаты */
  paymentSystems: number[];
  /** id валют */
  currencies: number[];
  /** поиск по названию */
  search: string;
}

export const EMPTY_PS_FILTER: PsFilterState = {
  services: [],
  games: [],
  paymentSystems: [],
  currencies: [],
  search: "",
};

export type PsSortKey = "commission" | "rating" | "platforms";
export type PsSort = SortState<PsSortKey>;

const collectPlatforms = (services: PaymentService[], kind: "service" | "game") => {
  const map = new Map<number, PaymentServicePlatform>();
  services.forEach((service) =>
    service.platforms
      .filter((platform) => (kind === "game" ? platform.kind === "game" : platform.kind !== "game"))
      .forEach((platform) => map.set(platform.id, platform)),
  );
  return Array.from(map.values())
    .sort((a, b) => a.title.localeCompare(b.title, "ru"))
    .map<MultiSelectOption>((platform) => ({
      id: platform.id,
      title: platform.title,
      icon: platform.icon ?? undefined,
    }));
};

export const collectPsServices = (services: PaymentService[]) =>
  collectPlatforms(services, "service");

export const collectPsGames = (services: PaymentService[]) => collectPlatforms(services, "game");

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

export const collectPsCurrencies = (services: PaymentService[]) => {
  const map = new Map<number, StrapiCurrency>();
  services.forEach((service) =>
    service.currencies.forEach((currency) => map.set(currency.id, currency)),
  );
  return Array.from(map.values())
    .sort((a, b) => (a.code ?? a.title).localeCompare(b.code ?? b.title, "ru"))
    .map<MultiSelectOption>((currency) => ({
      id: currency.id,
      title: currency.code ? `${currency.code} — ${currency.title}` : currency.title,
      icon: currency.icon ?? undefined,
      code: currency.code,
    }));
};

export function isPsFilterActive(filter: PsFilterState): boolean {
  return (
    filter.services.length > 0 ||
    filter.games.length > 0 ||
    filter.paymentSystems.length > 0 ||
    filter.currencies.length > 0 ||
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

    if (filter.services.length > 0 && !filter.services.every((id) => platformIds.includes(id))) {
      return false;
    }

    if (filter.games.length > 0 && !filter.games.every((id) => platformIds.includes(id))) {
      return false;
    }

    if (
      filter.paymentSystems.length > 0 &&
      !service.payment_systems.some((method) => filter.paymentSystems.includes(method.id))
    ) {
      return false;
    }

    if (
      filter.currencies.length > 0 &&
      !service.currencies.some((currency) => filter.currencies.includes(currency.id))
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
  const getValue = (service: PaymentService): number | null => {
    if (sort.key === "commission") return getCommissionValue(service);
    if (sort.key === "rating") return service.rating;
    return service.platforms.length;
  };

  // Array.prototype.sort стабилен — при равных значениях сохраняется порядок из API.
  return [...services].sort((a, b) => compareNullable(getValue(a), getValue(b), factor));
}

/** Сколько фильтров выбрано — для бейджа на кнопке «Фильтры» (поиск не считаем). */
export function countPsFilters(filter: PsFilterState): number {
  return (
    filter.services.length +
    filter.games.length +
    filter.paymentSystems.length +
    filter.currencies.length
  );
}
