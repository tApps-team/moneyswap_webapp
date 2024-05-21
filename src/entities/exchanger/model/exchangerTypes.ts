import { Name } from "@/shared/config";
type Review = {
  positive: number;
  neutral: number;
  negative: number;
};
export interface Exchanger {
  id: number;
  name: Name;
  partner_link: string;
  valute_from: string;
  icon_valute_from: string;
  valute_to: string;
  icon_valute_to: string;
  in_count: number;
  out_count: number;
  min_amount: string;
  max_amount: string;
  review_count: Review;
}
