import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { handleVibration, openExternalLink } from "@/shared/lib";
import { TagCell } from "./tag-cell";

/**
 * Мелкие блоки карточек рейтингов.
 * Порт moneyswap_next/src/shared/ui/rating-parts/rating-parts.tsx: десктопные варианты
 * (строки таблицы, hover-состояния) выброшены — мини-апп всегда узкий.
 */

/** Плашка «Лучшее предложение» над карточкой. */
export function VipBadge({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute z-10 bg-mainColor text-black text-[9px] font-bold uppercase px-2 py-1 rounded-[4px] shadow-sm whitespace-nowrap pointer-events-none",
        className,
      )}
    >
      {label}
    </div>
  );
}

/** Пара «подпись — значение». */
export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 rounded-[10px] bg-new-grey/40 px-2.5 py-2 min-w-0">
      <span className="text-lightGray text-[10px] uppercase tracking-wide truncate">{label}</span>
      {/* значения вроде «50 000 – 5 000 000 ₽» переносим, а не режем многоточием */}
      <span className="text-white text-xs font-medium leading-tight break-words">{value}</span>
    </div>
  );
}

/** Блок чипов с подписью. */
export function LabeledTags({
  label,
  items,
  chip,
}: {
  label: string;
  items: { id: number; title: string; icon?: string | null; code?: string }[];
  chip: "circle" | "icon" | "flag" | "code";
}) {
  if (!items?.length) return null;
  return (
    <div className="grid gap-1.5 min-w-0">
      <span className="text-lightGray text-[11px] uppercase tracking-wide font-medium">{label}</span>
      <TagCell
        items={items.map((item) => ({ ...item, icon: item.icon ?? undefined }))}
        modalTitle={label}
        chip={chip}
      />
    </div>
  );
}

/** Логотип + название. По тапу (если задан onOpen) открывает карточку агента. */
export function EntityIdentity({
  name,
  logo,
  subtitle,
  onOpen,
  className,
}: {
  name: string;
  logo: string | null;
  subtitle?: string | null;
  onOpen?: () => void;
  className?: string;
}) {
  const body = (
    <>
      {logo ? (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-contain bg-new-grey shrink-0"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-new-grey text-mainColor font-semibold shrink-0">
          {name.charAt(0)}
        </div>
      )}
      <span className="grid min-w-0 text-left">
        <span className="font-semibold text-white text-sm truncate">{name}</span>
        {subtitle ? <span className="text-lightGray text-xs truncate">{subtitle}</span> : null}
      </span>
    </>
  );

  if (!onOpen) {
    return <div className={cn("flex items-center gap-3 min-w-0", className)}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => {
        handleVibration();
        onOpen();
      }}
      className={cn("flex items-center gap-3 min-w-0 active:opacity-70", className)}
    >
      {body}
    </button>
  );
}

/** Рейтинг и количество отзывов. */
export function RatingValue({
  rating,
  reviewsCount,
  compact,
}: {
  rating: number | null | undefined;
  reviewsCount?: number;
  compact?: boolean;
}) {
  if (!rating) {
    return <span className="text-lightGray text-sm">—</span>;
  }

  return (
    <span className={cn("grid min-w-0 text-right", compact ? "text-[11px]" : "text-sm")}>
      <span className="text-mainColor font-semibold">{rating.toFixed(1)}</span>
      {reviewsCount ? (
        <span className="text-lightGray text-[10px] truncate">{reviewsCount} отзывов</span>
      ) : null}
    </span>
  );
}

/** Кнопки «Подробнее» и «Перейти» — в мини-аппе всегда в столбик. */
export function ActionButtons({
  onDetails,
  url,
  actionLabel,
  detailLabel,
  className,
}: {
  onDetails?: () => void;
  url: string;
  actionLabel: string;
  detailLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {onDetails && detailLabel ? (
        <button
          type="button"
          onClick={() => {
            handleVibration();
            onDetails();
          }}
          className="w-full text-center rounded-[10px] border border-[#575A62] text-white font-medium text-[13px] px-4 py-2.5 active:opacity-70"
        >
          {detailLabel}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => {
          handleVibration();
          openExternalLink(url);
        }}
        className="w-full text-center rounded-[10px] bg-mainColor text-black font-semibold text-[13px] px-4 py-2.5 active:opacity-80 whitespace-nowrap"
      >
        {actionLabel}
      </button>
    </div>
  );
}

/** Пустая выдача — с кнопкой сброса, если фильтры активны. */
export function EmptyResult({
  active,
  emptyText,
  filteredText,
  resetText,
  onReset,
}: {
  active: boolean;
  emptyText: string;
  filteredText: string;
  resetText: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center py-10 px-4 bg-new-dark-grey rounded-[16px] border border-new-grey/60">
      <p className="text-lightGray text-sm">{active ? filteredText : emptyText}</p>
      {active && (
        <button
          type="button"
          onClick={() => {
            handleVibration();
            onReset();
          }}
          className="text-sm text-mainColor active:opacity-70"
        >
          {resetText}
        </button>
      )}
    </div>
  );
}
