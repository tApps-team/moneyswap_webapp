import {
  BankCredit,
  CardCategory,
  CreditCard,
  DebitCard,
  EsimCalls,
  EsimInternetSharing,
  EsimTopUp,
  EsimValidityPeriod,
  Microloan,
  MicroloanAmountType,
  MicroloanApproval,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanTermType,
  MicroloanVerificationStatus,
  PaymentService,
  PaymentServicePlatform,
  ReviewRating,
  StrapiReview,
  VirtualCard,
} from "../model/ratings";
import { parseBigInteger, parseLastNumeric, parseNumeric, formatMoney, stripHtmlToText } from "./numeric";

/* ------------------------------------------------------------------ */
/* Общее                                                                */
/* ------------------------------------------------------------------ */

const ratingScoreMap: Record<ReviewRating, number> = {
  positive: 5,
  neutral: 3,
  negative: 1,
};

/** Средняя оценка по отзывам — для разделов, где Strapi не отдаёт готовый `rating`. */
export function getReviewsRating(reviews: StrapiReview[] = []) {
  const reviewCount = reviews.length;
  if (reviewCount === 0) return { ratingValue: 0, reviewCount: 0 };

  const totalScore = reviews.reduce((sum, review) => sum + (ratingScoreMap[review.rating] ?? 3), 0);

  return {
    ratingValue: Math.round((totalScore / reviewCount) * 10) / 10,
    reviewCount,
  };
}

export function getReviewBreakdown(reviews: StrapiReview[] = []) {
  return reviews.reduce(
    (acc, review) => {
      if (review.rating === "positive") acc.positive += 1;
      else if (review.rating === "negative") acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );
}

export function formatRating(rating: number | null | undefined): string {
  return rating ? rating.toFixed(1) : "—";
}

/** Склонение «отзыв / отзыва / отзывов». */
export function formatReviewsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} отзыв`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} отзыва`;
  return `${count} отзывов`;
}

/** Минимальная форма элемента динамической зоны, из которой берём текст. */
interface ParagraphLike {
  paragraph?: { content?: string | null } | null;
}

/**
 * Первый абзац страницы раздела в виде чистого текста — для описания на карточке хаба.
 * Контент лежит с HTML-разметкой, поэтому теги вырезаем, а длинный текст режем по границе слова.
 */
export function getFirstParagraphText(
  content: ParagraphLike[] | undefined | null,
  limit = 200,
): string | null {
  const item = content?.find((entry) => entry?.paragraph?.content);
  const raw = item?.paragraph?.content;
  if (!raw) return null;

  const text = stripHtmlToText(raw);
  if (!text) return null;
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]+$/, "")}…`;
}

const toOptions = <T extends string>(map: Record<T, string>) =>
  (Object.keys(map) as T[]).map((id) => ({ id, title: map[id] }));

/* ------------------------------------------------------------------ */
/* ВЭД                                                                  */
/* ------------------------------------------------------------------ */

export function formatVedLimit(value: string | null | undefined): string {
  if (value == null || value === "") return "—";
  const numeric = Number(String(value).replace(/\s/g, ""));
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat("ru-RU").format(numeric);
}

/* ------------------------------------------------------------------ */
/* Виртуальные карты                                                    */
/* ------------------------------------------------------------------ */

export function formatVcIssuance(card: VirtualCard): string {
  return `от ${card.issuance_cost} ₽`;
}

/* ------------------------------------------------------------------ */
/* eSIM                                                                 */
/* ------------------------------------------------------------------ */

const validityPeriodMap: Record<string, string> = {
  from_1_day: "от 1 дня",
  from_3_days: "от 3 дней",
  from_5_days: "от 5 дней",
  from_7_days: "от 7 дней",
  from_10_days: "от 10 дней",
  from_30_days: "от 30 дней",
  from_6_months: "от 6 месяцев",
  from_1_year: "от 1 года",
  from_2_years: "от 2 лет",
  unlimited: "Безлимит",
};

const internetSharingMap: Record<string, string> = {
  with_sharing: "С раздачей интернета",
  without_sharing: "Без раздачи интернета",
};

const callsMap: Record<string, string> = {
  with_calls: "С звонками",
  without_calls: "Без звонков",
};

const topUpMap: Record<string, string> = {
  with_top_up: "С пополнением",
  without_top_up: "Без пополнения",
};

export const formatEsimPrice = (price: number) => `от ${price} ₽`;
export const formatEsimVolume = (gb: number) => `от ${gb} ГБ`;
export const formatEsimValidityPeriod = (period: EsimValidityPeriod) =>
  validityPeriodMap[period] ?? period;
export const formatEsimInternetSharing = (value: EsimInternetSharing) =>
  internetSharingMap[value] ?? value;
export const formatEsimCalls = (value: EsimCalls) => callsMap[value] ?? value;
export const formatEsimTopUp = (value: EsimTopUp) => topUpMap[value] ?? value;

/* ------------------------------------------------------------------ */
/* Оплата сервисов                                                      */
/* ------------------------------------------------------------------ */

/** Комиссия для карточки: «От 3%» как есть, пусто — прочерк. */
export function formatCommission(service: PaymentService): string {
  if (service.commission) return service.commission;
  if (service.commission_from != null) return `от ${service.commission_from}%`;
  return "—";
}

/** Числовая комиссия для сортировки (падает обратно на разбор строки). */
export function getCommissionValue(service: PaymentService): number | null {
  return service.commission_from ?? parseNumeric(service.commission);
}

export const isGamePlatform = (platform: PaymentServicePlatform) => platform.kind === "game";
export const isServicePlatform = (platform: PaymentServicePlatform) => platform.kind !== "game";

/* ------------------------------------------------------------------ */
/* Карты                                                                */
/* ------------------------------------------------------------------ */

const cardCategoryMap: Record<CardCategory, string> = {
  classic: "Классическая",
  electronic: "Электронная",
  gold: "Золотая",
  premium: "Премиальная",
  virtual: "Виртуальная",
};

export const CARD_CATEGORY_OPTIONS = toOptions(cardCategoryMap);

export function formatCardCategory(category: CardCategory | null): string {
  return category ? (cardCategoryMap[category] ?? category) : "—";
}

/** Кэшбэк в процентах для сортировки: «до 16.5%» → 16.5. */
export function getCashbackValue(card: DebitCard | CreditCard): number | null {
  return parseNumeric(card.cashback);
}

/** Процент на остаток: «Нет» и «—» считаем отсутствующим значением. */
export function getPercentOnBalanceValue(card: DebitCard): number | null {
  if (!card.percent_on_balance || /^нет$/i.test(card.percent_on_balance.trim())) return null;
  return parseNumeric(card.percent_on_balance);
}

/** Кредитный лимит числом: сначала явное поле, потом разбор строки. */
export function getCreditLimitValue(card: CreditCard): number | null {
  return parseBigInteger(card.credit_limit_value) ?? parseLastNumeric(card.credit_limit);
}

/** Ставка по кредитке: «29.9%–61.9%» → 29.9 (нижняя граница). */
export function getCardRateValue(card: CreditCard): number | null {
  return parseNumeric(card.rate);
}

/** Стоимость обслуживания числом: «Бесплатно» → 0. */
export function getServiceCostValue(card: DebitCard | CreditCard): number | null {
  if (!card.service_cost) return null;
  if (/бесплатн/i.test(card.service_cost)) return 0;
  return parseNumeric(card.service_cost);
}

/** Группы льготного периода. */
export type GracePeriodBucket = "30" | "60" | "90" | "120" | "180";

export const GRACE_PERIOD_OPTIONS: { id: GracePeriodBucket; title: string }[] = [
  { id: "30", title: "от 30 дней" },
  { id: "60", title: "от 60 дней" },
  { id: "90", title: "от 90 дней" },
  { id: "120", title: "от 120 дней" },
  { id: "180", title: "от 180 дней" },
];

/** Карта попадает в группу, если её грейс не меньше порога. */
export function matchesGracePeriod(card: CreditCard, buckets: GracePeriodBucket[]): boolean {
  if (!buckets.length) return true;
  const days = card.grace_period_days ?? parseNumeric(card.grace_period);
  if (days == null) return false;
  return buckets.some((bucket) => days >= Number(bucket));
}

/* ------------------------------------------------------------------ */
/* Кредиты                                                              */
/* ------------------------------------------------------------------ */

/** Ставка числом для сортировки: «22,9–42,1%» → 22.9. */
export function getCreditRateValue(credit: BankCredit): number | null {
  return parseNumeric(credit.rate);
}

/** Максимальная сумма кредита числом. */
export function getCreditAmountValue(credit: BankCredit): number | null {
  return parseBigInteger(credit.amount_limits?.to) ?? parseLastNumeric(credit.amount);
}

/** Минимальная сумма кредита числом — для фильтра «сумма от». */
export function getCreditMinAmountValue(credit: BankCredit): number | null {
  return parseBigInteger(credit.amount_limits?.from) ?? parseNumeric(credit.amount);
}

export function getCreditTermValue(credit: BankCredit): number | null {
  return credit.term_months ?? null;
}

/** Группы срока — фильтр «Срок кредита». */
export type CreditTermBucket = "12" | "36" | "60" | "84" | "120";

export const CREDIT_TERM_OPTIONS: { id: CreditTermBucket; title: string }[] = [
  { id: "12", title: "до 1 года" },
  { id: "36", title: "до 3 лет" },
  { id: "60", title: "до 5 лет" },
  { id: "84", title: "до 7 лет" },
  { id: "120", title: "от 10 лет" },
];

/** Кредит подходит, если его максимальный срок покрывает выбранную группу. */
export function matchesCreditTerm(credit: BankCredit, buckets: CreditTermBucket[]): boolean {
  if (!buckets.length) return true;
  const months = getCreditTermValue(credit);
  if (months == null) return false;
  return buckets.some((bucket) => months >= Number(bucket));
}

/* ------------------------------------------------------------------ */
/* Микрозаймы                                                           */
/* ------------------------------------------------------------------ */

const approvalMap: Record<MicroloanApproval, string> = {
  high: "Высокое",
  medium: "Среднее",
  low: "Низкое",
};

const amountTypeMap: Record<MicroloanAmountType, string> = {
  to_30000: "До 30 000 ₽",
  to_50000: "До 50 000 ₽",
  to_100000: "До 100 000 ₽",
};

const termTypeMap: Record<MicroloanTermType, string> = {
  to_30_days: "До 30 дней",
  to_35_days: "До 35 дней",
  to_180_days: "До 180 дней",
};

const firstLoanMap: Record<MicroloanFirstLoanType, string> = {
  zero_first_loan: "Первый займ под 0%",
  standard_rate: "Стандартная ставка",
  needs_verification: "Требует проверки",
};

const verificationMap: Record<MicroloanVerificationStatus, string> = {
  confirmed: "Условия подтверждены",
  manual_check: "Нужна ручная проверка",
};

const limitTypeMap: Record<MicroloanLimitType, string> = {
  small: "Небольшой лимит",
  medium: "Средний лимит",
  large: "Крупный лимит",
};

const durationTypeMap: Record<MicroloanDurationType, string> = {
  short: "Короткий срок",
  about_month: "Срок около месяца",
  long: "Долгий срок",
};

export const MICROLOAN_AMOUNT_OPTIONS = toOptions(amountTypeMap);
export const MICROLOAN_TERM_OPTIONS = toOptions(termTypeMap);
export const MICROLOAN_FIRST_LOAN_OPTIONS = toOptions(firstLoanMap);
export const MICROLOAN_VERIFICATION_OPTIONS = toOptions(verificationMap);
export const MICROLOAN_LIMIT_OPTIONS = toOptions(limitTypeMap);
export const MICROLOAN_DURATION_OPTIONS = toOptions(durationTypeMap);
export const MICROLOAN_APPROVAL_OPTIONS = toOptions(approvalMap);

export const formatApproval = (value: MicroloanApproval | null) =>
  value ? (approvalMap[value] ?? value) : "—";
export const formatLoanAmountType = (value: MicroloanAmountType | null) =>
  value ? (amountTypeMap[value] ?? value) : "—";
export const formatLoanTermType = (value: MicroloanTermType | null) =>
  value ? (termTypeMap[value] ?? value) : "—";
export const formatFirstLoanType = (value: MicroloanFirstLoanType | null) =>
  value ? (firstLoanMap[value] ?? value) : "—";
export const formatVerificationStatus = (value: MicroloanVerificationStatus | null) =>
  value ? (verificationMap[value] ?? value) : "—";
export const formatLimitType = (value: MicroloanLimitType | null) =>
  value ? (limitTypeMap[value] ?? value) : "—";
export const formatDurationType = (value: MicroloanDurationType | null) =>
  value ? (durationTypeMap[value] ?? value) : "—";

/** Лимит для карточки: сумма из данных, иначе подпись группы. */
export function formatMicroloanLimit(loan: Microloan): string {
  const max = parseBigInteger(loan.amount_limits?.to);
  if (max != null) return `до ${formatMoney(max)}`;
  return formatLoanAmountType(loan.loan_amount_type);
}

/** Срок для карточки: дни из данных, иначе подпись группы. */
export function formatMicroloanTerm(loan: Microloan): string {
  const max = loan.term_limits?.to;
  if (max != null) return `до ${max} дн.`;
  return formatLoanTermType(loan.loan_term_type);
}

export function getMicroloanLimitValue(loan: Microloan): number | null {
  return parseBigInteger(loan.amount_limits?.to);
}

export function getMicroloanRateValue(loan: Microloan): number | null {
  return parseNumeric(loan.rate);
}

export function getMicroloanTermValue(loan: Microloan): number | null {
  return loan.term_limits?.to ?? null;
}
