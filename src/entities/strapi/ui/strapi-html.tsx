import { FC, MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { handleVibration, openExternalLink } from "@/shared/lib";

interface StrapiHtmlProps {
  html?: string | null;
  className?: string;
}

/**
 * HTML-строка из Strapi (ответ FAQ, текст блока) со стилями `.strapi_content`:
 * списки, заголовки и ссылки приходят разметкой, без неё они бы выводились как голый текст.
 *
 * Клики по ссылкам перехватываем: обычный переход внутри Telegram WebView
 * увёл бы пользователя из мини-аппа.
 */
export const StrapiHtml: FC<StrapiHtmlProps> = ({ html, className }) => {
  if (!html) return null;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement)?.closest?.("a");
    if (!anchor) return;
    event.preventDefault();
    handleVibration();
    openExternalLink(anchor.getAttribute("href"));
  };

  return (
    <div
      className={cn("strapi_content", className)}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
