export type IncreaseLinkCountReq = {
  user_id: number;
  exchange_id: number;
  valute_from: string;
  valute_to: string;
  city_id: number | null;
}