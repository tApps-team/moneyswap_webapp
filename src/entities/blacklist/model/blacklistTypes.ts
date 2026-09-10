import { Name } from "@/shared/config";

/** Запись чёрного списка: API отдаёт только id и название. */
export interface BlacklistItem {
  id: number;
  exchangerName: Name;
}

/** Детали записи: логотип, домен и связанные с ним площадки. */
export interface BlacklistDetail extends BlacklistItem {
  iconUrl: string | null;
  url: string | null;
  linked_urls: string[];
}
