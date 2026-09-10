import { FC } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { PaymentService, formatCommission } from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  RatingValue,
  VipBadge,
} from "@/shared/ui/ratings";

interface PsCardProps {
  service: PaymentService;
  onOpen: (slug: string) => void;
}

/** Порт мобильной карточки PsCard с сайта. */
export const PsCard: FC<PsCardProps> = ({ service, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        service.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {service.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={service.name}
          logo={service.logo}
          onOpen={() => onOpen(service.slug)}
          className="flex-1"
        />
        <RatingValue rating={service.rating} reviewsCount={service.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label={t("ratings.ps.commission")} value={formatCommission(service)} />
        <Field label={t("ratings.ps.platforms")} value={`${service.platforms.length}`} />
      </div>

      <div className="grid gap-3">
        <LabeledTags
          label={t("ratings.ps.payment_methods")}
          items={service.payment_systems}
          chip="icon"
        />
        <LabeledTags label={t("ratings.ps.platforms")} items={service.platforms} chip="icon" />
        <LabeledTags label={t("ratings.currencies")} items={service.currencies} chip="code" />
      </div>

      <ActionButtons
        onDetails={() => onOpen(service.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.go")}
        url={service.url}
      />
    </article>
  );
};
