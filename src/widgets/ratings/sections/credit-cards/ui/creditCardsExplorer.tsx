import { FC } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  CreditCard,
  GRACE_PERIOD_OPTIONS,
  GracePeriodBucket,
  formatCardCategory,
  orDash,
  useGetCreditCardsQuery,
} from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  MultiSelectFilter,
  RatingValue,
  SortChips,
  VipBadge,
} from "@/shared/ui/ratings";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import { CardCategoryRow, CardFilters } from "../../cards/ui/cardFilters";
import {
  CreditCardFilterState,
  CreditCardSortKey,
  EMPTY_CREDIT_CARD_FILTER,
  countCreditCardFilters,
  filterCreditCards,
  isCreditCardFilterActive,
  sortCreditCards,
} from "../lib/filter";

/** Кредитные карты. Детальной страницы у раздела нет и на сайте — только оформление. */
export const CreditCardsExplorer: FC = () => {
  const { t } = useTranslation();
  const { data: cards = [], isLoading, isError } = useGetCreditCardsQuery();

  const explorer = useExplorer<CreditCard, CreditCardFilterState, CreditCardSortKey>({
    items: cards,
    emptyFilter: EMPTY_CREDIT_CARD_FILTER,
    filterFn: filterCreditCards,
    sortFn: sortCreditCards,
    isActiveFn: isCreditCardFilterActive,
    countFn: countCreditCardFilters,
  });

  return (
    <ExplorerLayout
      isLoading={isLoading}
      isError={isError}
      total={explorer.total}
      active={explorer.active}
      onReset={explorer.reset}
      page={explorer.page}
      totalPages={explorer.totalPages}
      onPageChange={explorer.setPage}
      controls={
        <>
          <CardFilters
            cards={cards}
            filter={explorer.filter}
            setFilter={explorer.setFilter}
            activeCount={explorer.activeCount}
            active={explorer.active}
            onReset={explorer.reset}
            extra={
              <MultiSelectFilter<GracePeriodBucket>
                label={t("ratings.cards.grace_period")}
                options={GRACE_PERIOD_OPTIONS}
                selected={explorer.filter.gracePeriods}
                onChange={(gracePeriods) => explorer.setFilter((f) => ({ ...f, gracePeriods }))}
                variant="icon"
                searchable={false}
              />
            }
          />
          <SortChips
            options={[
              { key: "grace", label: t("ratings.cards.grace_period") },
              { key: "limit", label: t("ratings.cards.credit_limit") },
              { key: "rate", label: t("ratings.cards.rate") },
              { key: "service", label: t("ratings.cards.service") },
              { key: "rating", label: t("ratings.rating") },
            ]}
            sort={explorer.sort}
            onSort={explorer.handleSort}
          />
        </>
      }
    >
      {explorer.visible.map((card) => (
        <CreditCardItem key={card.id} card={card} />
      ))}
    </ExplorerLayout>
  );
};

const CreditCardItem: FC<{ card: CreditCard }> = ({ card }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        card.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {card.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={card.name}
          logo={card.logo ?? card.bank?.logo ?? null}
          subtitle={card.bank?.title}
          className="flex-1"
        />
        <RatingValue rating={card.rating} reviewsCount={card.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label={t("ratings.cards.grace_period")} value={orDash(card.grace_period)} />
        <Field label={t("ratings.cards.credit_limit")} value={orDash(card.credit_limit)} />
        <Field label={t("ratings.cards.rate")} value={orDash(card.rate)} />
        <Field label={t("ratings.cards.service")} value={orDash(card.service_cost)} />
      </div>

      <div className="grid gap-3">
        <LabeledTags label={t("ratings.cards.features")} items={card.features} chip="icon" />
        <LabeledTags label={t("ratings.cards.bonuses")} items={card.bonuses} chip="icon" />
        <LabeledTags
          label={t("ratings.cards.payment_system")}
          items={card.payment_systems}
          chip="icon"
        />
      </div>

      <CardCategoryRow
        label={t("ratings.cards.category")}
        value={formatCardCategory(card.card_category)}
      />

      <ActionButtons actionLabel={t("ratings.apply")} url={card.url} />
    </article>
  );
};
