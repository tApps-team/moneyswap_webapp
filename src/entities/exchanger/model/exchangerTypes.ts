import { Name } from "@/shared/config";

export interface Exchanger {
  id: number;
  name: Name;
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  is_vip: boolean;
  partner_link: string;
  valute_from: string;
  icon_valute_from: string;
  valute_to: string;
  icon_valute_to: string;
  in_count: number;
  out_count: number;
  min_amount: string | null;
  max_amount: string | null;
  review_count: {
    positive: number;
    neutral: number;
    negative: number;
  };
  info?: {
    bankomats: Bankomat[] | null;
    delivery: boolean;
    office: boolean;
    working_days: {
      Пн: boolean;
      Вт: boolean;
      Ср: boolean;
      Чт: boolean;
      Пт: boolean;
      Сб: boolean;
      Вс: boolean;
    };
    weekdays: { time_from: string; time_to: string };
    weekends: { time_from: string; time_to: string };
  };
  params?: string;
  fromfee?: number | null;
  exchange_direction_id: number;
  direction_marker: DirectionMarker;
}

export enum ExchangerMarker {
  cash = "cash",
  no_cash = "no_cash",
  partner = "partner",
}

export enum DirectionMarker {
  city = "city",
  country = "country",
}

export interface Bankomat {
  id: number;
  available: boolean;
  name: string;
  icon: string;
}
