import { FC } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { VedAgent, formatVedLimit } from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  LabeledTags,
  VipBadge,
} from "@/shared/ui/ratings";

interface VedCardProps {
  agent: VedAgent;
  onOpen: (slug: string) => void;
}

/** Карточка платёжного агента — порт мобильного варианта VedAgentCard с сайта. */
export const VedCard: FC<VedCardProps> = ({ agent, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        agent.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {agent.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <EntityIdentity
        name={agent.name}
        logo={agent.logo}
        onOpen={() => onOpen(agent.slug)}
        className="flex-1"
      />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-mainColor/15 text-mainColor font-medium whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {t("ratings.ved.from_commission", { value: agent.commission })}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
          <span className="text-lightGray">{t("ratings.from")}</span>
          <span className="text-green-400 font-medium">{formatVedLimit(agent.limits.from)}</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-new-grey">
          <span className="text-lightGray">{t("ratings.to")}</span>
          <span className="text-[#e8a090] font-medium">{formatVedLimit(agent.limits.to)}</span>
        </span>
      </div>

      <div className="grid gap-3">
        <LabeledTags label={t("ratings.ved.labels")} items={agent.labels} chip="circle" />
        <LabeledTags label={t("ratings.countries")} items={agent.countries} chip="flag" />
        <LabeledTags label={t("ratings.currencies")} items={agent.currencies} chip="code" />
      </div>

      <ActionButtons
        onDetails={() => onOpen(agent.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.contact")}
        url={agent.url}
      />
    </article>
  );
};
