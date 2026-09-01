import {
  Coins,
  CreditCard,
  Globe,
  Landmark,
  LucideIcon,
  Smartphone,
  Wallet,
  WalletCards,
} from "lucide-react";

/** Ключи разделов-рейтингов — совпадают с сегментом URL на сайте и со значением `?section=`. */
export type RatingSectionKey =
  | "ved"
  | "virtual-cards"
  | "esim"
  | "payment-services"
  | "debit-cards"
  | "credit-cards"
  | "credits"
  | "microloans";

export interface RatingSection {
  key: RatingSectionKey;
  /** Ключ i18n для короткого названия раздела. */
  titleKey: string;
  /** Ключ i18n для фолбэк-описания (когда Strapi не отдал вводный текст). */
  descriptionKey: string;
  icon: LucideIcon;
}

/**
 * Единый список разделов. Порядок и состав повторяют сайт
 * (moneyswap_next/src/shared/consts/rating-sections.ts), чтобы разделы не расходились.
 */
export const RATING_SECTIONS: RatingSection[] = [
  {
    key: "ved",
    titleKey: "ratings.sections.ved.title",
    descriptionKey: "ratings.sections.ved.description",
    icon: Globe,
  },
  {
    key: "virtual-cards",
    titleKey: "ratings.sections.virtual-cards.title",
    descriptionKey: "ratings.sections.virtual-cards.description",
    icon: CreditCard,
  },
  {
    key: "esim",
    titleKey: "ratings.sections.esim.title",
    descriptionKey: "ratings.sections.esim.description",
    icon: Smartphone,
  },
  {
    key: "payment-services",
    titleKey: "ratings.sections.payment-services.title",
    descriptionKey: "ratings.sections.payment-services.description",
    icon: Wallet,
  },
  {
    key: "debit-cards",
    titleKey: "ratings.sections.debit-cards.title",
    descriptionKey: "ratings.sections.debit-cards.description",
    icon: WalletCards,
  },
  {
    key: "credit-cards",
    titleKey: "ratings.sections.credit-cards.title",
    descriptionKey: "ratings.sections.credit-cards.description",
    icon: CreditCard,
  },
  {
    key: "credits",
    titleKey: "ratings.sections.credits.title",
    descriptionKey: "ratings.sections.credits.description",
    icon: Landmark,
  },
  {
    key: "microloans",
    titleKey: "ratings.sections.microloans.title",
    descriptionKey: "ratings.sections.microloans.description",
    icon: Coins,
  },
];

export const RATING_SECTION_KEYS = RATING_SECTIONS.map((section) => section.key);

export const isRatingSectionKey = (value: string | null | undefined): value is RatingSectionKey =>
  !!value && (RATING_SECTION_KEYS as string[]).includes(value);
