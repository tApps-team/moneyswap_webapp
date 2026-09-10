/**
 * Динамическая зона Strapi — общий формат контента для страниц разделов (`header_content`)
 * и обзоров агентов (`about`). Скопировано из moneyswap_next/src/entities/strapi/blog/model/article.ts,
 * чтобы формат не разъезжался между сайтом и мини-аппом.
 */

export enum CustomButtonType {
  main_color = "main_color",
  grey_color = "grey_color",
  blue_color = "blue_color",
}

export enum ComponentPosition {
  left = "left",
  center = "center",
  right = "right",
}

export interface Paragraph {
  title: string | null;
  title_id: string | null;
  title_position: ComponentPosition;
  content: string;
}

export interface Quote {
  content: string;
  button_name?: string;
  button_url?: string;
  target?: string;
  button_type?: CustomButtonType;
}

export interface CustomButton {
  button_name: string;
  button_url: string;
  target: string;
  button_type: CustomButtonType;
  button_position: ComponentPosition;
}

export interface CustomAccordion {
  title: string | null;
  question: string;
  answer: string;
}

export enum DynamicContentType {
  paragraph = "paragraph",
  quote = "quote",
  custom_button = "custom_button",
  custom_accordion = "accordion",
}

export type DynamicContentItem = {
  content_type: DynamicContentType;
  custom_button?: CustomButton | null;
  quote?: Quote | null;
  paragraph?: Paragraph | null;
  accordion?: CustomAccordion | null;
};

/** Страница-обёртка раздела (single type в Strapi). */
export interface SectionPage {
  title: string;
  header_content: DynamicContentItem[];
  footer_content: DynamicContentItem[];
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: { pagination?: StrapiPagination };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
}
