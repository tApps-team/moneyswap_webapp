import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { buildMiniAppLink, handleVibration, shareLink } from "@/shared/lib";
import { useAppNavigation } from "@/shared/routing";

interface ShareCurrentButtonProps {
  /** Что подставить в текст пересылки: название раздела или агента. */
  label?: string;
  className?: string;
}

/**
 * «Поделиться» текущим экраном.
 *
 * Состояние берём прямо из адресной строки, поэтому компонент можно ставить куда угодно
 * внутри вкладок — прокидывать пропсы через explorer'ы не нужно.
 * Без VITE_TG_MINIAPP_URL кнопки нет: пустая или чужая ссылка хуже её отсутствия.
 */
export const ShareCurrentButton: FC<ShareCurrentButtonProps> = ({ label, className }) => {
  const { t } = useTranslation();
  const { tab, section, item } = useAppNavigation();

  const link = buildMiniAppLink({ tab, section, item });
  if (!link) return null;

  return (
    <button
      type="button"
      aria-label={t("ratings.share")}
      onClick={() => {
        handleVibration();
        shareLink(link, label ? t("ratings.share_text", { name: label }) : undefined);
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
