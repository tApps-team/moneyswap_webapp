import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { RATING_SECTIONS, RatingSection, RatingSectionKey } from "@/shared/config";
import { SectionHeader } from "@/shared/ui/ratings";
import { handleVibration } from "@/shared/lib";

interface RatingsHubProps {
  onOpenSection: (section: RatingSectionKey) => void;
}

/** Хаб разделов рейтингов: то же содержимое, что и /ratings на сайте, в одну колонку. */
export const RatingsHub: FC<RatingsHubProps> = ({ onOpenSection }) => {
  const { t } = useTranslation();

  return (
    <section className="grid gap-4 min-w-0">
      <SectionHeader title={t("ratings.hub_title")} subtitle={t("ratings.hub_subtitle")} />

      <div className="grid gap-3 min-w-0">
        {RATING_SECTIONS.map((section) => (
          <RatingSectionCard key={section.key} section={section} onOpen={onOpenSection} />
        ))}
      </div>
    </section>
  );
};

const RatingSectionCard: FC<{
  section: RatingSection;
  onOpen: (section: RatingSectionKey) => void;
}> = ({ section, onOpen }) => {
  const { t } = useTranslation();
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={() => {
        handleVibration();
        onOpen(section.key);
      }}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full min-w-0 rounded-[16px] border border-new-grey/60 bg-new-dark-grey p-4 text-left active:opacity-80"
    >
      <span className="grid place-items-center size-11 shrink-0 rounded-[12px] bg-new-grey text-mainColor">
        <Icon className="size-5" strokeWidth={1.6} />
      </span>

      <span className="grid gap-1 min-w-0">
        <span className="unbounded_font uppercase leading-tight text-xs font-normal text-white break-words">
          {t(section.titleKey)}
        </span>
        <span className="text-lightGray text-xs leading-snug line-clamp-2">
          {t(section.descriptionKey)}
        </span>
      </span>

      <ChevronRight className="size-5 shrink-0 text-mainColor" />
    </button>
  );
};
