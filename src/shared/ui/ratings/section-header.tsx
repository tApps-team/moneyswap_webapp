import { ChevronDown } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";

interface SectionHeaderProps {
  title: string;
  subtitle?: string | null;
  /** Кнопка справа от заголовка — например «Поделиться». */
  action?: ReactNode;
  className?: string;
}

/** Заголовок экрана рейтингов — тем же шрифтом Unbounded, что и на сайте. */
export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle, action, className }) => (
  <div className={cn("grid gap-2 min-w-0", className)}>
    <div className="flex items-start justify-between gap-3 min-w-0">
      <h1 className="unbounded_font text-mainColor uppercase text-base font-semibold leading-tight break-words min-w-0">
        {title}
      </h1>
      {action}
    </div>
    {subtitle ? <p className="text-lightGray text-xs leading-snug">{subtitle}</p> : null}
  </div>
);

interface CollapsibleBlockProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Свёрнутый блок «О разделе»: вводный SEO-текст со Strapi длинный,
 * и на маленьком экране он не должен отодвигать список вниз.
 */
export const CollapsibleBlock: FC<CollapsibleBlockProps> = ({ title, children, className }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("grid gap-3 min-w-0", className)}>
      <button
        type="button"
        onClick={() => {
          handleVibration();
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        className="flex items-center justify-between gap-3 w-full rounded-[12px] border border-new-grey/60 bg-new-dark-grey px-4 py-3 text-left text-sm text-white active:opacity-80"
      >
        <span className="min-w-0 truncate">{title ?? t("ratings.about_section")}</span>
        <ChevronDown
          className={cn("w-4 h-4 shrink-0 text-mainColor transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? children : null}
    </div>
  );
};
