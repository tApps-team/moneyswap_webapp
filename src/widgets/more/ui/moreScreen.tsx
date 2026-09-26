import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, LifeBuoy, Loader, LucideIcon, Send, UserCog } from "lucide-react";
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

/**
 * Внешняя ссылка строкой-кнопкой.
 * Именно кнопка с openExternalLink, а не <a href>: обычная ссылка выкидывает
 * пользователя из Telegram WebView в браузер.
 */
const LinkButton = ({
  url,
  label,
  icon: Icon,
}: {
  url: string;
  label: string;
  icon: LucideIcon;
}) => (
  <button
    type="button"
    onClick={() => {
      handleVibration();
      openExternalLink(url);
    }}
    className="flex items-center gap-3 w-full rounded-[12px] border border-new-grey/50 bg-new-dark-grey p-4 text-left active:opacity-80"
  >
    <span className="grid place-items-center size-9 shrink-0 rounded-full bg-new-grey text-mainColor">
      <Icon className="size-4" />
    </span>
    <span className="text-sm text-white min-w-0 truncate">{label}</span>
  </button>
);

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
  const links: { url: string; labelKey: string; icon: LucideIcon }[] = [
    {
      url: import.meta.env.VITE_TG_BOT_URL || "https://t.me/MoneySwap_robot",
      labelKey: "more.telegram_bot",
      icon: Send,
    },
    {
      url: import.meta.env.VITE_TG_CHANNEL_URL || "https://t.me/+hFVeT_X36hs0ZWFi",
      labelKey: "more.telegram_channel",
      icon: Send,
    },
  ];

  /** Контакты выделены в отдельный блок — иконки другие, чтобы не сливались со ссылками. */
  const contacts: { url: string; labelKey: string; icon: LucideIcon }[] = [
    {
      url: import.meta.env.VITE_TG_SUPPORT_URL || "https://t.me/MoneySwap_support",
      labelKey: "more.support",
      icon: LifeBuoy,
    },
    {
      url: import.meta.env.VITE_TG_ADMIN_URL || "https://t.me/moneyswap_admin",
      labelKey: "more.admin",
      icon: UserCog,
    },
  ];

  return (
    <section className="grid gap-4 min-w-0">
      <SectionHeader title={t("more.title")} />

      {/* Ссылки на бота и канал */}
      <div className="grid gap-2 min-w-0">
        {links.map((link) => (
          <LinkButton key={link.labelKey} {...link} label={t(link.labelKey)} />
        ))}
      </div>

      {/* Контакты: админ и поддержка */}
      <h2 className="unbounded_font text-white uppercase text-sm font-semibold mt-2">
        {t("more.contacts")}
      </h2>
      <div className="grid gap-2 min-w-0">
        {contacts.map((contact) => (
          <LinkButton key={contact.labelKey} {...contact} label={t(contact.labelKey)} />
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
