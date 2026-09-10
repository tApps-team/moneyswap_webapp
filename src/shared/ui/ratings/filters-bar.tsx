import { Search, SlidersHorizontal, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-12 flex-1 min-w-0 px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey",
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("ratings.search")}
        className="w-full min-w-0 bg-transparent text-base text-white placeholder:text-lightGray outline-none"
      />
      {value ? (
        <button
          type="button"
          aria-label={t("ratings.reset")}
          onClick={() => {
            handleVibration();
            onChange("");
          }}
          className="shrink-0"
        >
          <X className="w-4 h-4 text-lightGray" />
        </button>
      ) : (
        <Search className="w-4 h-4 text-lightGray shrink-0" />
      )}
    </div>
  );
}

interface FiltersBarProps {
  search?: ReactNode;
  /** Сколько фильтров сейчас выбрано — показывается на кнопке «Фильтры» (поиск не считаем). */
  activeCount?: number;
  canReset?: boolean;
  onReset?: () => void;
  children?: ReactNode;
  className?: string;
}

/**
 * Панель фильтров раздела: видны поиск и кнопка «Фильтры», сами фильтры разворачиваются
 * по тапу — иначе список уезжает за нижнюю границу экрана.
 */
export function FiltersBar({
  search,
  activeCount = 0,
  canReset,
  onReset,
  children,
  className,
}: FiltersBarProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const showReset = (canReset ?? activeCount > 0) && Boolean(onReset);
  const hasFilters = Boolean(children);

  return (
    <div className={cn("grid gap-3 min-w-0", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {search}
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              handleVibration();
              setOpen((value) => !value);
            }}
            aria-expanded={open}
            className={cn(
              "flex items-center gap-2 h-12 shrink-0 px-4 rounded-[14px] border text-sm",
              open || activeCount > 0
                ? "border-mainColor/70 bg-mainColor/10 text-mainColor"
                : "border-new-grey/60 bg-new-dark-grey text-lightGray",
            )}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            {/* на самых узких экранах оставляем только иконку, чтобы поиск не сжимался */}
            <span className="hidden mobile:inline">{t("ratings.filters")}</span>
            {activeCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-mainColor text-black text-2xs font-semibold">
                {activeCount}
              </span>
            )}
          </button>
        )}
      </div>

      {hasFilters && open && (
        <div className="flex flex-col gap-3 min-w-0">
          {children}

          {showReset && (
            <button
              type="button"
              onClick={() => {
                handleVibration();
                onReset?.();
              }}
              className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] border border-new-grey/60 text-sm text-lightGray active:opacity-70"
            >
              {t("ratings.reset")}
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
