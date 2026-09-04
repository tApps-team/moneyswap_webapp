import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { StartParamKey, buildMiniAppLink, handleVibration, shareLink } from "@/shared/lib";

interface ShareButtonProps {
  /** Состояние, которое должна открыть ссылка: те же ключи, что понимает startapp. */
  params: Partial<Record<StartParamKey, string | null>>;
  /** Что подставить в текст пересылки — название раздела, агента или обменника. */
  label?: string;
  className?: string;
}

/**
 * «Поделиться» ссылкой на конкретный экран мини-аппа.
 *
 * Без VITE_TG_MINIAPP_URL кнопки нет: пустая или чужая ссылка хуже её отсутствия.
 */
export const ShareButton: FC<ShareButtonProps> = ({ params, label, className }) => {
  const { t } = useTranslation();

  const link = buildMiniAppLink(params);
  if (!link) return null;

  return (
    <button
      type="button"
      aria-label={t("share")}
      onClick={(event) => {
        event.stopPropagation();
        handleVibration();
        shareLink(link, label ? t("share_text", { name: label }) : undefined);
      }}
      className={cn(
        "grid place-items-center size-9 shrink-0 rounded-full border border-new-grey/60 bg-new-dark-grey text-mainColor active:opacity-70",
        className,
      )}
    >
      <Share2 className="size-4" />
    </button>
  );
};
