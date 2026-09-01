import { FC } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { VirtualCard, formatVcIssuance } from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  VipBadge,
} from "@/shared/ui/ratings";

interface VcCardProps {
  card: VirtualCard;
  onOpen: (slug: string) => void;
}

/** Порт мобильной карточки VcCard с сайта. */
export const VcCard: FC<VcCardProps> = ({ card, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        card.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {card.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <EntityIdentity
        name={card.name}
        logo={card.logo}
        onOpen={() => onOpen(card.slug)}
        className="flex-1"
      />

      <div className="grid grid-cols-3 gap-2">
        <Field label={t("ratings.vc.issuance")} value={formatVcIssuance(card)} />
        <Field label={t("ratings.vc.topup")} value={card.topup_commission} />
        <Field label={t("ratings.vc.maintenance")} value={card.maintenance_info} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label={t("ratings.vc.platforms")} items={card.platforms} chip="icon" />
        <LabeledTags
          label={t("ratings.ps.payment_methods")}
          items={card.payment_systems}
          chip="icon"
        />
        <LabeledTags label={t("ratings.currencies")} items={card.currencies} chip="code" />
      </div>

      <ActionButtons
        onDetails={() => onOpen(card.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.issue")}
        url={card.url}
      />
    </article>
  );
};
