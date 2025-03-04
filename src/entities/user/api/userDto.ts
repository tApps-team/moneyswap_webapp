import { DirectionMarker, ExchangerMarker } from "@/entities/exchanger";

export type IncreaseLinkCountReq = {
  user_id: number;
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  exchange_direction_id: number;
};

export type IncreaseLinkCountPartnersReq = {
  user_id: number;
  exchange_id: number;
  direction_marker: DirectionMarker;
  exchange_direction_id: number;
};
