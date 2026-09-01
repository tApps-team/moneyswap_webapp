import { FC } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DebitCard, formatCardCategory, orDash, useGetDebitCardsQuery } from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  LabeledTags,
  RatingValue,
  SortChips,
  VipBadge,
} from "@/shared/ui/ratings";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import { CardCategoryRow, CardFilters } from "../../cards/ui/cardFilters";
import {
  DebitCardFilterState,
  DebitCardSortKey,
  EMPTY_DEBIT_CARD_FILTER,
  countDebitCardFilters,
  filterDebitCards,
  isDebitCardFilterActive,
  sortDebitCards,
} from "../lib/filter";

/**
 * Дебетовые карты. Детальной страницы у раздела нет и на сайте (поле `about` пустое),
 * поэтому карточка ведёт сразу на оформление — без «Подробнее».
 */
export const DebitCardsExplorer: FC = () => {
  const { t } = useTranslation();
  const { data: cards = [], isLoading, isError } = useGetDebitCardsQuery();

  const explorer = useExplorer<DebitCard, DebitCardFilterState, DebitCardSortKey>({
    items: cards,
    emptyFilter: EMPTY_DEBIT_CARD_FILTER,
    filterFn: filterDebitCards,
    sortFn: sortDebitCards,
    isActiveFn: isDebitCardFilterActive,
    countFn: countDebitCardFilters,
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
          />
          <SortChips
            options={[
              { key: "cashback", label: t("ratings.cards.cashback") },
              { key: "percent", label: t("ratings.cards.percent") },
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
        <DebitCardItem key={card.id} card={card} />
      ))}
    </ExplorerLayout>
  );
};

const DebitCardItem: FC<{ card: DebitCard }> = ({ card }) => {
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
        <Field label={t("ratings.cards.service")} value={orDash(card.service_cost)} />
        <Field label={t("ratings.cards.transfer_limit")} value={orDash(card.transfer_limit)} />
        <Field label={t("ratings.cards.cashback")} value={orDash(card.cashback)} />
        <Field label={t("ratings.cards.percent")} value={orDash(card.percent_on_balance)} />
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
