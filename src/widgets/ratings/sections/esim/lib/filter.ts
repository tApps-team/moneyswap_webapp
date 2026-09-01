import { Esim, StrapiRef } from "@/entities/strapi";
import { SortState } from "@/shared/ui/ratings";

/** Порт moneyswap_next/src/widgets/esim/esim-explorer/lib/filter.ts. */

export interface EsimFilterState {
  /** id выбранных стран */
  countries: number[];
  /** минимальный объём интернета в ГБ (сырой ввод) */
  minVolume: string;
  /** только с раздачей интернета */
  sharing: boolean;
  /** только со звонками */
  calls: boolean;
  /** только с продлением (пополнением) */
  topUp: boolean;
}

export const EMPTY_ESIM_FILTER: EsimFilterState = {
  countries: [],
  minVolume: "",
  sharing: false,
  calls: false,
  topUp: false,
};

/** Парсит объём из инпута (оставляя только цифры). */
export function parseVolume(value: string): number | null {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : null;
}

/** Уникальные страны из всех eSIM, отсортированные по названию. */
export function collectEsimCountries(services: Esim[]): StrapiRef[] {
  const map = new Map<number, StrapiRef>();
  services.forEach((service) => service.countries.forEach((c) => map.set(c.id, c)));
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function isEsimFilterActive(filter: EsimFilterState): boolean {
  return (
    filter.countries.length > 0 ||
    filter.minVolume.trim() !== "" ||
    filter.sharing ||
    filter.calls ||
    filter.topUp
  );
}

export function countEsimFilters(filter: EsimFilterState): number {
  return (
    filter.countries.length +
    (filter.sharing ? 1 : 0) +
    (filter.calls ? 1 : 0) +
    (filter.topUp ? 1 : 0)
  );
}

export type EsimSortKey = "price" | "volume" | "period";
export type EsimSort = SortState<EsimSortKey>;

/** Приблизительная длительность срока в днях — для сортировки колонки «Срок». */
const validityDaysMap: Record<string, number> = {
  from_1_day: 1,
  from_3_days: 3,
  from_5_days: 5,
  from_7_days: 7,
  from_10_days: 10,
  from_30_days: 30,
  from_6_months: 180,
  from_1_year: 365,
  from_2_years: 730,
  unlimited: Number.POSITIVE_INFINITY,
};

/** Сортирует eSIM по выбранной колонке. null-значения всегда в конце. */
export function sortEsims(services: Esim[], sort: EsimSort | null): Esim[] {
  if (!sort) return services;

  const factor = sort.dir === "asc" ? 1 : -1;
  const getValue = (service: Esim): number | null => {
    if (sort.key === "price") return service.connection_price;
    if (sort.key === "volume") return service.internet_volume;
    return validityDaysMap[service.validity_period] ?? null;
  };

  // Array.prototype.sort стабилен — при равных значениях порядок из API сохраняется.
  return [...services].sort((a, b) => {
    const va = getValue(a);
    const vb = getValue(b);
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (va === vb) return 0;
    return va < vb ? -factor : factor;
  });
}

export function filterEsims(services: Esim[], filter: EsimFilterState): Esim[] {
  const minVolume = parseVolume(filter.minVolume);

  return services.filter((service) => {
    if (
      filter.countries.length > 0 &&
      !service.countries.some((c) => filter.countries.includes(c.id))
    ) {
      return false;
    }

    if (minVolume != null && service.internet_volume < minVolume) {
      return false;
    }

    if (filter.sharing && service.internet_sharing !== "with_sharing") {
      return false;
    }

    if (filter.calls && service.calls !== "with_calls") {
      return false;
    }

    if (filter.topUp && service.top_up !== "with_top_up") {
      return false;
    }

    return true;
  });
}
