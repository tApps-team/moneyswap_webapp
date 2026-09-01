import { ChevronDown } from "lucide-react";
import { FC, MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { handleVibration, openExternalLink } from "@/shared/lib";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";
import { DynamicContentItem, DynamicContentType } from "../model/content";

interface StrapiContentProps {
  content?: DynamicContentItem[] | null;
  className?: string;
}

/**
 * Рендер динамической зоны Strapi.
 *
 * Контент приходит с нашего собственного Strapi и уже содержит HTML-разметку,
 * поэтому вставляем его напрямую (без html-react-parser — лишняя зависимость).
 * Клики по ссылкам перехватываем: обычный переход внутри Telegram WebView
 * увёл бы пользователя из мини-аппа.
 */
export const StrapiContent: FC<StrapiContentProps> = ({ content, className }) => {
  if (!content?.length) return null;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement)?.closest?.("a");
    if (!anchor) return;
    event.preventDefault();
    handleVibration();
    openExternalLink(anchor.getAttribute("href"));
  };

  return (
    <div className={cn("grid gap-3 min-w-0", className)}>
      {content.map((item, index) => {
        if (item.content_type === DynamicContentType.paragraph && item.paragraph) {
          return (
            <div key={index} className="bg-new-dark-grey rounded-[12px] p-4 min-w-0">
              {item.paragraph.title && (
                <h2 className="text-mainColor text-[15px] font-semibold leading-snug mb-2">
                  {item.paragraph.title}
                </h2>
              )}
              <div
                className="strapi_content"
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: item.paragraph.content }}
              />
            </div>
          );
        }

        if (item.content_type === DynamicContentType.quote && item.quote) {
          return (
            <div key={index} className="bg-new-dark-grey rounded-[12px] p-4 min-w-0">
              <div
                className="strapi_content"
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: item.quote.content }}
              />
              {item.quote.button_name && item.quote.button_url && (
                <button
                  type="button"
                  onClick={() => {
                    handleVibration();
                    openExternalLink(item.quote?.button_url);
                  }}
                  className="mt-3 w-full rounded-[10px] bg-mainColor px-4 py-2.5 text-[13px] font-semibold text-black active:opacity-80"
                >
                  {item.quote.button_name}
                </button>
              )}
            </div>
          );
        }

        if (item.content_type === DynamicContentType.custom_accordion && item.accordion) {
          return (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem
                value={`item-${index}`}
                className="border-none bg-new-dark-grey rounded-[12px] px-4"
              >
                <AccordionTrigger
                  onClick={handleVibration}
                  className="w-full border-0 gap-3 text-left text-sm text-white [&>svg]:data-[state=open]:rotate-180"
                >
                  <span className="min-w-0">{item.accordion?.question}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-mainColor transition-transform" />
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="strapi_content pb-2"
                    onClick={handleClick}
                    dangerouslySetInnerHTML={{ __html: item.accordion.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }

        if (item.content_type === DynamicContentType.custom_button && item.custom_button) {
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                handleVibration();
                openExternalLink(item.custom_button?.button_url);
              }}
              className="w-full rounded-[10px] bg-mainColor px-4 py-2.5 text-[13px] font-semibold text-black active:opacity-80"
            >
              {item.custom_button.button_name}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
};
