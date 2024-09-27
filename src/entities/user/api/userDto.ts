import { ExchangerMarker } from "@/entities/exchanger";

export type IncreaseLinkCountReq = {
  user_id: number;
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  exchange_direction_id: number;
};
