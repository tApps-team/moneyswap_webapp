import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Gift } from "lucide-react";
import clsx from "clsx";
import { DynamicContentItem, StrapiContent, StrapiPromocode } from "@/entities/strapi";
import { Drawer, DrawerContent, DrawerTitle, ScrollArea } from "@/shared/ui";
import { useDrawerBackButton } from "@/shared/hooks";
import { handleVibration, isTelegramMobile, openExternalLink } from "@/shared/lib";

export interface AgentSpecRow {
  label: string;
  value: ReactNode;
}

interface AgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Заголовок карточки: «Сервис оплаты FunPay», название агента и т.п. */
  title: string;
  name: string;
  logo: string | null;
  /** Строка ключевых метрик под заголовком (комиссия, лимиты, рейтинг). */
  headline?: ReactNode;
  description?: string | null;
  actionLabel: string;
  url: string;
  specs: AgentSpecRow[];
  promocodes?: StrapiPromocode[];
  about?: DynamicContentItem[];
}

/**
 * Карточка агента — полноэкранный drawer поверх списка раздела.
 *
 * Повторяет схему widgets/reviewDrawer: боковой drawer, ScrollArea с data-vaul-no-drag
 * и кнопка «Назад» Telegram с приоритетом 1 (диалог `+N` внутри перекрывает её приоритетом 2).
 */
export const AgentDrawer: FC<AgentDrawerProps> = ({
  isOpen,
  onClose,
  title,
  name,
  logo,
  headline,
  description,
  actionLabel,
  url,
  specs,
  promocodes,
  about,
}) => {
  const { t } = useTranslation();
  const isMobilePlatform = isTelegramMobile();
  const hasPromocodes = Boolean(promocodes?.length);

  useDrawerBackButton({ isOpen, onClose, priority: 1 });

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      direction="right"
    >
      <DrawerContent
        className={clsx("p-0 w-full grid gap-4 bg-[#191C25] border-none", {
          "pt-[90px]": isMobilePlatform,
        })}
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>

        <ScrollArea
          data-vaul-no-drag
          className={clsx("w-full px-4 pb-6 pt-4 h-[100svh]", {
            "h-[calc(100svh_-_100px)]": isMobilePlatform,
          })}
        >
          <div className="grid gap-4 pb-6">
            {/* Шапка */}
            <div className="bg-new-dark-grey rounded-[16px] p-4 grid gap-4 min-w-0">
              <div className="flex items-start gap-3 min-w-0">
                {logo ? (
                  <img
                    src={logo}
                    alt={name}
                    loading="lazy"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-contain bg-new-grey shrink-0"
                  />
                ) : (
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-new-grey text-mainColor font-semibold text-xl shrink-0">
                    {name.charAt(0)}
                  </div>
                )}
                <div className="grid gap-1.5 min-w-0">
                  <h2 className="unbounded_font text-mainColor uppercase text-sm font-semibold leading-tight break-words">
                    {title}
                  </h2>
                  {headline ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      {headline}
                    </div>
                  ) : null}
                </div>
              </div>

              {description ? (
                <p className="text-lightGray text-xs leading-snug">{description}</p>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  handleVibration();
                  openExternalLink(url);
                }}
                className="w-full rounded-[10px] bg-mainColor px-5 py-3 text-[13px] font-semibold uppercase text-black active:opacity-80"
              >
                {actionLabel}
              </button>
            </div>

            {/* Характеристики */}
            {specs.length > 0 && (
              <div className="bg-new-dark-grey rounded-[16px] overflow-hidden">
                {specs.map((row, index) => (
                  <div
                    key={row.label}
                    className={clsx(
                      "flex items-start justify-between gap-4 px-4 py-3 min-w-0",
                      index < specs.length - 1 && "border-b border-[#575A62]/40",
                    )}
                  >
                    <span className="text-xs text-lightGray shrink-0 pt-0.5">{row.label}</span>
                    <div className="text-xs text-white text-right min-w-0 flex justify-end">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Промокоды */}
            {hasPromocodes && (
              <div className="grid gap-2 min-w-0">
                <h3 className="unbounded_font text-white uppercase text-sm font-semibold">
                  {t("ratings.promocodes")}
                </h3>
                {promocodes?.map((promo, index) => (
                  <button
                    key={`${promo.title}-${index}`}
                    type="button"
                    onClick={() => {
                      handleVibration();
                      openExternalLink(promo.url || url);
                    }}
                    className="flex items-start gap-3 bg-new-dark-grey border border-[#575A62]/50 rounded-[12px] p-4 text-left active:opacity-80 min-w-0"
                  >
                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-mainColor/15 text-mainColor">
                      <Gift className="w-4 h-4" />
                    </span>
                    <span className="grid gap-1 min-w-0">
                      <span className="font-semibold text-white text-sm break-words">
                        {promo.title}
                      </span>
                      {promo.description ? (
                        <span className="text-xs text-lightGray break-words">
                          {promo.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Обзор из Strapi */}
            <StrapiContent content={about} />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
