import { FC } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  Esim,
  formatEsimPrice,
  formatEsimValidityPeriod,
  formatEsimVolume,
} from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  VipBadge,
} from "@/shared/ui/ratings";

interface EsimCardProps {
  esim: Esim;
  onOpen: (slug: string) => void;
}

/** Порт мобильной карточки EsimCard с сайта. */
export const EsimCard: FC<EsimCardProps> = ({ esim, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        esim.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {esim.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <EntityIdentity
        name={esim.name}
        logo={esim.logo}
        onOpen={() => onOpen(esim.slug)}
        className="flex-1"
      />

      <div className="grid grid-cols-3 gap-2">
        <Field label={t("ratings.esim.price")} value={formatEsimPrice(esim.connection_price)} />
        <Field label={t("ratings.esim.volume")} value={formatEsimVolume(esim.internet_volume)} />
        <Field
          label={t("ratings.esim.period")}
          value={formatEsimValidityPeriod(esim.validity_period)}
        />
      </div>

      <div className="grid gap-3">
        <LabeledTags label={t("ratings.ved.labels")} items={esim.labels} chip="circle" />
        <LabeledTags label={t("ratings.countries")} items={esim.countries} chip="flag" />
        <LabeledTags
          label={t("ratings.ps.payment_methods")}
          items={esim.payment_systems}
          chip="icon"
        />
      </div>

      <ActionButtons
        onDetails={() => onOpen(esim.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.go")}
        url={esim.url}
      />
    </article>
  );
};
