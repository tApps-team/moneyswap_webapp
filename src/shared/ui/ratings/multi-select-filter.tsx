import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";
import { useDrawerBackButton } from "@/shared/hooks";
import { Drawer, DrawerDescription, DrawerSheetContent, DrawerTitle } from "../drawer";

/** id — число для справочников Strapi и строка для enum-значений (категория карты, тип лимита). */
export interface MultiSelectOption<T extends string | number = number> {
  id: T;
  title: string;
  icon?: string | null;
  code?: string;
}

interface MultiSelectFilterProps<T extends string | number = number> {
  label: string;
  searchPlaceholder?: string;
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (ids: T[]) => void;
  /**
   * Как рисовать иконку элемента:
   * - "flag" — обрезка по кругу (object-cover);
   * - "icon" — логотип целиком (object-contain);
   * - "code" — плашка с кодом, если иконки нет.
   */
  variant?: "flag" | "code" | "icon";
  /** Скрыть строку поиска — для коротких списков вроде «Категория карты». */
  searchable?: boolean;
}

/**
 * Мультивыбор с поиском. В мини-аппе всегда нижний лист — десктопной выпадашки из
 * moneyswap_next тут нет за ненадобностью (ширина экрана ограничена 500px).
 */
export function MultiSelectFilter<T extends string | number = number>({
  label,
  searchPlaceholder,
  options,
  selected,
  onChange,
  variant = "flag",
  searchable = true,
}: MultiSelectFilterProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useDrawerBackButton({ isOpen: open, onClose: () => setOpen(false), priority: 1 });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        (o.code ? o.code.toLowerCase().includes(query) : false),
    );
  }, [options, search]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const toggle = (id: T) => {
    handleVibration();
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const count = selected.length;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          handleVibration();
          setOpen(true);
        }}
        className="flex items-center justify-between gap-3 w-full h-12 px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey text-sm text-white active:opacity-80"
      >
        <span className={cn("truncate", count ? "text-white" : "text-lightGray")}>{label}</span>
        <span className="flex items-center gap-2 shrink-0">
          {count > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-mainColor text-black text-2xs font-semibold">
              {count}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-lightGray" />
        </span>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerSheetContent className="min-h-[70svh] px-4 pb-6 pt-4">
          <DrawerTitle className="mb-3 shrink-0 text-base text-white">{label}</DrawerTitle>
          <DrawerDescription className="sr-only">{label}</DrawerDescription>

          <div className="flex flex-1 flex-col gap-3 min-h-0">
            {searchable && (
              <div className="flex items-center gap-2 h-11 shrink-0 px-3 rounded-[12px] border border-new-grey/60 bg-new-grey/20">
                <Search className="w-4 h-4 text-lightGray shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder ?? t("ratings.search")}
                  className="w-full bg-transparent text-base text-white placeholder:text-lightGray outline-none"
                />
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto -mr-1 pr-1" data-vaul-no-drag>
              {filtered.length === 0 ? (
                <p className="text-center text-lightGray text-sm py-6">{t("ratings.not_found")}</p>
              ) : (
                <ul className="flex flex-col">
                  {filtered.map((option) => {
                    const checked = selected.includes(option.id);
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => toggle(option.id)}
                          className="flex items-center justify-between gap-3 w-full px-2 py-2.5 rounded-[10px] text-left active:bg-new-grey/40"
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            {variant === "code" && !option.icon ? (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-new-grey text-2xs text-lightGray uppercase shrink-0">
                                {option.code ?? option.title.charAt(0)}
                              </span>
                            ) : option.icon ? (
                              <img
                                src={option.icon}
                                alt={option.title}
                                loading="lazy"
                                width={24}
                                height={24}
                                className={cn(
                                  "w-6 h-6 rounded-full shrink-0",
                                  variant === "flag" ? "object-cover" : "object-contain",
                                )}
                              />
                            ) : null}
                            <span className="truncate text-sm text-white">{option.title}</span>
                          </span>

                          <span
                            className={cn(
                              "flex items-center justify-center w-5 h-5 rounded-[6px] border shrink-0",
                              checked
                                ? "border-mainColor bg-mainColor text-black"
                                : "border-new-light-grey",
                            )}
                          >
                            {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                handleVibration();
                setOpen(false);
              }}
              className="w-full h-11 shrink-0 rounded-[12px] bg-mainColor text-black text-sm font-semibold active:opacity-80"
            >
              {t("ratings.done")}
            </button>
          </div>
        </DrawerSheetContent>
      </Drawer>
    </>
  );
}
