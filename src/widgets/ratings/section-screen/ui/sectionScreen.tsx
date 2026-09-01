import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { StrapiContent, useGetSectionPageQuery } from "@/entities/strapi";
import { RATING_SECTIONS, RatingSectionKey } from "@/shared/config";
import { CollapsibleBlock, SectionHeader } from "@/shared/ui/ratings";
import { handleVibration } from "@/shared/lib";
import { VedExplorer } from "../../sections/ved";
import { VcExplorer } from "../../sections/virtual-cards";
import { EsimExplorer } from "../../sections/esim";
import { PsExplorer } from "../../sections/payment-services";
import { DebitCardsExplorer } from "../../sections/debit-cards";
import { CreditCardsExplorer } from "../../sections/credit-cards";
import { CreditsExplorer } from "../../sections/credits";
import { MfoExplorer } from "../../sections/microloans";

interface SectionScreenProps {
  section: RatingSectionKey;
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
  onBack: () => void;
}

/** Экран одного раздела рейтингов: заголовок, свёрнутый вводный текст и список. */
export const SectionScreen: FC<SectionScreenProps> = ({
  section,
  openedSlug,
  onOpenItem,
  onCloseItem,
  onBack,
}) => {
  const { t } = useTranslation();
  const { data: page } = useGetSectionPageQuery(section);

  const config = RATING_SECTIONS.find((item) => item.key === section);
  const title = page?.title ?? (config ? t(config.titleKey) : "");
  const itemProps = { openedSlug, onOpenItem, onCloseItem };

  return (
    <section className="grid gap-4 min-w-0">
      <button
        type="button"
        onClick={() => {
          handleVibration();
          onBack();
        }}
        className="flex items-center gap-1 self-start text-sm text-lightGray active:opacity-70"
      >
        <ChevronLeft className="w-4 h-4" />
        {t("ratings.back_to_hub")}
      </button>

      <SectionHeader title={title} />

      {page?.header_content?.length ? (
        <CollapsibleBlock title={t("ratings.about_section")}>
          <StrapiContent content={page.header_content} />
        </CollapsibleBlock>
      ) : null}

      {section === "ved" && <VedExplorer {...itemProps} />}
      {section === "virtual-cards" && <VcExplorer {...itemProps} />}
      {section === "esim" && <EsimExplorer {...itemProps} />}
      {section === "payment-services" && <PsExplorer {...itemProps} />}
      {section === "debit-cards" && <DebitCardsExplorer />}
      {section === "credit-cards" && <CreditCardsExplorer />}
      {section === "credits" && <CreditsExplorer {...itemProps} />}
      {section === "microloans" && <MfoExplorer {...itemProps} />}
    </section>
  );
};
