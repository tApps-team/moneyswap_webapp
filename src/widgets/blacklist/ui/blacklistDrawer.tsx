import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Loader, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import { BlacklistItem, useGetBlacklistDetailQuery } from "@/entities/blacklist";
import { Drawer, DrawerContent, DrawerTitle, ScrollArea } from "@/shared/ui";
import { useDrawerBackButton } from "@/shared/hooks";
import { handleVibration, isTelegramMobile, openExternalLink } from "@/shared/lib";

interface BlacklistDrawerProps {
  item: BlacklistItem;
  onClose: () => void;
}

/** Детали записи чёрного списка — полноэкранный drawer, как у карточки агента. */
export const BlacklistDrawer: FC<BlacklistDrawerProps> = ({ item, onClose }) => {
  const { t } = useTranslation();
  const isMobilePlatform = isTelegramMobile();
  const { data: detail, isLoading } = useGetBlacklistDetailQuery({ exchange_id: item.id });

  useDrawerBackButton({ isOpen: true, onClose, priority: 1 });

  const name = item.exchangerName?.ru || item.exchangerName?.en || "";
  const links = [detail?.url, ...(detail?.linked_urls ?? [])].filter(Boolean) as string[];

  return (
    <Drawer
      open
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
        <DrawerTitle className="sr-only">{name}</DrawerTitle>

        <ScrollArea
          data-vaul-no-drag
          className={clsx("w-full px-4 pb-6 pt-4 h-[100svh]", {
            "h-[calc(100svh_-_100px)]": isMobilePlatform,
          })}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin size-6 text-mainColor" />
            </div>
          ) : (
            <div className="grid gap-4 pb-6">
              <div className="bg-new-dark-grey rounded-[16px] p-4 grid gap-3 min-w-0">
                <div className="flex items-start gap-3 min-w-0">
                  {detail?.iconUrl ? (
                    <img
                      src={detail.iconUrl}
                      alt={name}
                      loading="lazy"
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover bg-new-grey shrink-0"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-new-grey text-red-500 shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  )}
                  <div className="grid gap-1 min-w-0">
                    <span className="unbounded_font uppercase text-[10px] text-[#7A7C80] font-semibold">
                      {t("blacklist.exchanger")}
                    </span>
                    <h2 className="unbounded_font uppercase text-sm font-semibold text-red-500 leading-tight break-words">
                      {t("blacklist.in_blacklist", { name })}
                    </h2>
                  </div>
                </div>

                <div className="rounded-[12px] border border-orange-600/30 bg-orange-900/10 p-3">
                  <p className="text-xs text-white leading-snug">{t("blacklist.warning")}</p>
                </div>
              </div>

              {links.length > 0 && (
                <div className="grid gap-2 min-w-0">
                  <h3 className="unbounded_font text-white uppercase text-sm font-semibold">
                    {t("blacklist.links")}
                  </h3>
                  {links.map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => {
                        handleVibration();
                        openExternalLink(link);
                      }}
                      className="flex items-center justify-between gap-2 bg-new-dark-grey border border-[#575A62]/50 rounded-[12px] p-4 text-left active:opacity-80 min-w-0"
                    >
                      <span className="text-xs text-white break-all">{link}</span>
                      <ExternalLink className="w-4 h-4 shrink-0 text-lightGray" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
