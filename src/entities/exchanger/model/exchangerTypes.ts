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
    time_from: string;
    time_to: string;
  };
  params: string;
  fromfee: number | null;
  exchange_direction_id: number;
}

export enum ExchangerMarker {
  cash = "cash",
  no_cash = "no_cash",
  partner = "partner",
}
