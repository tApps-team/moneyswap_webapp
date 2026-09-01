import { DynamicContentItem } from "./content";

/* ------------------------------------------------------------------ */
/* Общие справочники                                                    */
/* ------------------------------------------------------------------ */

/** Элемент справочника Strapi: метка, страна, платёжная система, особенность карты и т.п. */
export interface StrapiRef {
  id: number;
  title: string;
  icon: string | null;
  slug: string;
}

export interface StrapiCurrency {
  id: number;
  title: string;
  icon: string | null;
  code: string;
}

export interface StrapiPromocode {
  title: string;
  icon: string | null;
  description: string | null;
  url: string | null;
}

export type ReviewRating = "positive" | "neutral" | "negative";

export interface StrapiReview {
  id: number;
  username: string;
  rating: ReviewRating;
  text: string;
  review_date?: string;
}

/** Рынок для eSIM и виртуальных карт. */
export type MarketType = "international" | "russian";

/* ------------------------------------------------------------------ */
/* ВЭД                                                                  */
/* ------------------------------------------------------------------ */

export interface VedAgentLimits {
  from: string | null;
  to: string | null;
}

export interface VedAgent {
  id: number;
  slug: string;
  name: string;
  url: string;
  logo: string | null;
  is_vip: boolean;
  commission: number;
  limits: VedAgentLimits;
  labels: StrapiRef[];
  countries: StrapiRef[];
  currencies: StrapiCurrency[];
  promocodes: StrapiPromocode[];
  reviews: StrapiReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Виртуальные карты                                                    */
/* ------------------------------------------------------------------ */

export interface VirtualCard {
  id: number;
  slug: string;
  name: string;
  url: string;
  market_type: MarketType;
  is_vip: boolean;
  logo: string | null;
  issuance_cost: number;
  maintenance_info: string;
  topup_commission: string;
  platforms: StrapiRef[];
  payment_systems: StrapiRef[];
  countries: StrapiRef[];
  currencies: StrapiCurrency[];
  promocodes: StrapiPromocode[];
  reviews: StrapiReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* eSIM                                                                 */
/* ------------------------------------------------------------------ */

export type EsimValidityPeriod = "from_1_day" | string;
export type EsimInternetSharing = "with_sharing" | "without_sharing" | string;
export type EsimCalls = "with_calls" | "without_calls" | string;
export type EsimTopUp = "with_top_up" | "without_top_up" | string;

export interface Esim {
  id: number;
  slug: string;
  name: string;
  url: string;
  market_type: MarketType;
  is_vip: boolean;
  logo: string | null;
  connection_price: number;
  internet_volume: number;
  validity_period: EsimValidityPeriod;
  internet_sharing: EsimInternetSharing;
  calls: EsimCalls;
  top_up: EsimTopUp;
  rating?: number;
  labels: StrapiRef[];
  countries: StrapiRef[];
  payment_systems: StrapiRef[];
  promocodes: StrapiPromocode[];
  reviews: StrapiReview[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Оплата сервисов                                                      */
/* ------------------------------------------------------------------ */

/** Сервисы и игры, которые умеет оплачивать посредник. */
export type PaymentServicePlatformKind = "service" | "game";

export interface PaymentServicePlatform {
  id: number;
  title: string;
  slug: string;
  kind: PaymentServicePlatformKind | null;
  icon: string | null;
}

export interface PaymentService {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  description: string | null;
  /** Человекочитаемая комиссия: «От 3%», «До 5%», «11%». */
  commission: string | null;
  /** Числовое значение комиссии — для сортировки. */
  commission_from: number | null;
  rating: number | null;
  reviews_count: number;
  payment_systems: StrapiRef[];
  currencies: StrapiCurrency[];
  platforms: PaymentServicePlatform[];
  promocodes: StrapiPromocode[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Карты (дебетовые и кредитные)                                        */
/* ------------------------------------------------------------------ */

export type CardCategory = "classic" | "electronic" | "gold" | "premium" | "virtual";

export interface Bank {
  id: number;
  title: string;
  slug: string;
  logo: string | null;
}

interface BaseCard {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  bank: Bank | null;
  /** Стоимость обслуживания: «Бесплатно», «от 0 до 1 188 ₽ в год». */
  service_cost: string | null;
  cashback: string | null;
  cashback_description: string | null;
  card_category: CardCategory | null;
  city: string | null;
  rating: number | null;
  reviews_count: number;
  features: StrapiRef[];
  bonuses: StrapiRef[];
  payment_systems: StrapiRef[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

export interface DebitCard extends BaseCard {
  /** Лимит переводов: «до 500 000 ₽/мес», «без комиссии». */
  transfer_limit: string | null;
  percent_on_balance: string | null;
}

export interface CreditCard extends BaseCard {
  /** Льготный период: «120 дней». */
  grace_period: string | null;
  grace_period_days: number | null;
  /** Кредитный лимит: «до 1 000 000 ₽». */
  credit_limit: string | null;
  /** biginteger из Strapi приходит строкой. */
  credit_limit_value: string | number | null;
  rate: string | null;
}

/* ------------------------------------------------------------------ */
/* Кредиты                                                              */
/* ------------------------------------------------------------------ */

export interface BankCredit {
  id: number;
  slug: string;
  /** Название продукта: «Наличными», «Прогресс». */
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  bank: Bank | null;
  description: string | null;
  /** Полная стоимость кредита: «22,892–42,090%». */
  psk: string | null;
  /** Ставка: «22,9–42,1%», «от 14,9%». */
  rate: string | null;
  /** Сумма: «50 000 – 5 000 000 ₽». */
  amount: string | null;
  amount_limits: { from: string | number | null; to: string | number | null };
  /** Срок: «до 5 лет». */
  term: string | null;
  term_months: number | null;
  rating: number | null;
  reviews_count: number;
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Микрозаймы                                                           */
/* ------------------------------------------------------------------ */

export type MicroloanApproval = "high" | "medium" | "low";
export type MicroloanAmountType = "to_30000" | "to_50000" | "to_100000";
export type MicroloanTermType = "to_30_days" | "to_35_days" | "to_180_days";
export type MicroloanFirstLoanType = "zero_first_loan" | "standard_rate" | "needs_verification";
export type MicroloanVerificationStatus = "confirmed" | "manual_check";
export type MicroloanLimitType = "small" | "medium" | "large";
export type MicroloanDurationType = "short" | "about_month" | "long";

export interface Microloan {
  id: number;
  slug: string;
  name: string;
  url: string;
  is_vip: boolean;
  logo: string | null;
  description: string | null;
  /** Ставка в день: «0,8%». */
  rate: string | null;
  /** Полная стоимость займа: «0–292%». */
  psk: string | null;
  approval: MicroloanApproval | null;
  amount_limits: { from: string | number | null; to: string | number | null };
  term_limits: { from: number | null; to: number | null };
  loan_amount_type: MicroloanAmountType | null;
  loan_term_type: MicroloanTermType | null;
  first_loan_type: MicroloanFirstLoanType | null;
  verification_status: MicroloanVerificationStatus | null;
  loan_limit_type: MicroloanLimitType | null;
  loan_duration_type: MicroloanDurationType | null;
  rating: number | null;
  reviews_count: number;
  issue_channels: StrapiRef[];
  collections: StrapiRef[];
  about?: DynamicContentItem[];
  publishedAt?: string;
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

export enum FaqType {
  basic = "basic",
  from_users = "from_users",
  cash = "cash",
  noncash = "noncash",
  for_partners = "for_partners",
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  type: FaqType | string;
}
