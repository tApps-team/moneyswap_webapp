import { Name } from "@/shared/config";
import { DirectionMarker, ExchangerStatus, SegmentMarker } from "@/shared/types";

export interface Exchanger {
  id: number;
  name: Name;
  exchange_id: number;
  partner_link: string;
  is_vip: boolean;
  review_count: {
    positive: number;
    neutral: number;
    negative: number;
  };
  valute_from: string;
  icon_valute_from: string;
  valute_to: string;
  icon_valute_to: string;
  in_count: number;
  out_count: number;
  min_amount: string | null;
  max_amount: string | null;
  info: {
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
    high_aml?: boolean;
  };
  exchange_direction_id: number;
  direction_marker: DirectionMarker;
  params?: string;
  fromfee?: number | null;
  exchange_rates: ExchangeRate[] | null;
  location_info?: LocationInfo;
}

export type LocationInfo = {
  id: number;
  name: Name;
  code_name: string;
  country: {
    name: Name;
    icon_url: string;
  };
};

export interface ExchangerDetail {
  id: number;
  exchangerName: Name;
  iconUrl: string;
  url: string;
  high_aml: boolean;
  workStatus: ExchangerStatus;
  reviews: {
    positive: number;
    neutral: number;
    negative: number;
  };
  country: string;
  segment_marker: SegmentMarker;
  amountReserves: string | null;
  exchangeRates: number;
  open: string;
  openOnMoneySwap: string;
  fromfee?: string | null;
}

export interface Bankomat {
  id: number;
  available: boolean;
  name: string;
  icon: string;
}

export type ExchangeRate = {
  min_count: number | null;
  max_count: number | null;
  in_count: number;
  out_count: number;
  rate_coefficient: number;
};