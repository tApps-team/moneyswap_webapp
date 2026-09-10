import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Loader, Send } from "lucide-react";
import { FaqItem, StrapiHtml, useGetFaqQuery } from "@/entities/strapi";
import { LanguageSwitcher } from "@/features/languageSwitch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";
import { SectionHeader } from "@/shared/ui/ratings";
import { handleVibration, openExternalLink } from "@/shared/lib";

/** Порядок групп FAQ повторяет страницу /help на сайте. */
const FAQ_GROUPS = ["basic", "noncash", "cash", "from_users", "for_partners"] as const;

export const MoreScreen = () => {
  const { t } = useTranslation();
  const { data: faq = [], isLoading } = useGetFaqQuery();

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    faq.forEach((item) => {
      const list = map.get(item.type) ?? [];
      list.push(item);
      map.set(item.type, list);
    });
    return map;
  }, [faq]);

  // Ссылки берём из .env, но он не в репозитории — оставляем продовые значения по умолчанию.
  const links = [
    {
      url: import.meta.env.VITE_TG_BOT_URL || "https://t.me/MoneySwap_robot",
      labelKey: "more.telegram_bot",
    },
    {
      url: import.meta.env.VITE_TG_CHANNEL_URL || "https://t.me/+hFVeT_X36hs0ZWFi",
      labelKey: "more.telegram_channel",
    },
  ];

  return (
    <section className="grid gap-4 min-w-0">
      <SectionHeader title={t("more.title")} />

      {/* Ссылки на бота и канал */}
      <div className="grid gap-2 min-w-0">
        {links.map((link) => (
          <button
            key={link.labelKey}
            type="button"
            onClick={() => {
              handleVibration();
              openExternalLink(link.url);
            }}
            className="flex items-center gap-3 w-full rounded-[12px] border border-new-grey/50 bg-new-dark-grey p-4 text-left active:opacity-80"
          >
            <span className="grid place-items-center size-9 shrink-0 rounded-full bg-new-grey text-mainColor">
              <Send className="size-4" />
            </span>
            <span className="text-sm text-white min-w-0 truncate">{t(link.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Язык интерфейса */}
      <LanguageSwitcher />

      {/* FAQ */}
      <h2 className="unbounded_font text-white uppercase text-sm font-semibold mt-2">
        {t("more.faq")}
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin size-6 text-mainColor" />
        </div>
      ) : (
        <div className="grid gap-4 min-w-0">
          {FAQ_GROUPS.map((group) => {
            const items = grouped.get(group);
            if (!items?.length) return null;

            return (
              <div key={group} className="grid gap-2 min-w-0">
                <h3 className="unbounded_font text-mainColor uppercase text-sm font-semibold leading-snug">
                  {t(`more.faq_groups.${group}`)}
                </h3>

                <Accordion type="single" collapsible className="grid gap-2">
                  {items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={`faq-${item.id}`}
                      className="border-none bg-new-dark-grey rounded-[12px] px-4"
                    >
                      <AccordionTrigger
                        onClick={handleVibration}
                        className="w-full border-0 gap-3 text-left text-sm text-white [&>svg]:data-[state=open]:rotate-180"
                      >
                        <span className="min-w-0">{item.question}</span>
                        <ChevronDown className="w-4 h-4 shrink-0 text-mainColor transition-transform" />
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <StrapiHtml html={item.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
