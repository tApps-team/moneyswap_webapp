import { FC, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CardCategory, CreditCard, DebitCard } from "@/entities/strapi";
import { FiltersBar, MultiSelectFilter, SearchInput } from "@/shared/ui/ratings";
import {
  BaseCardFilterState,
  collectCardBanks,
  collectCardBonuses,
  collectCardCategories,
  collectCardFeatures,
  collectCardPaymentSystems,
} from "../lib/cardFilter";

interface CardFiltersProps<F extends BaseCardFilterState> {
  cards: (DebitCard | CreditCard)[];
  filter: F;
  setFilter: (updater: (filter: F) => F) => void;
  activeCount: number;
  active: boolean;
  onReset: () => void;
  /** Дополнительные фильтры раздела (например, льготный период у кредиток). */
  extra?: ReactNode;
}

/** Общая панель фильтров дебетовых и кредитных карт. */
export function CardFilters<F extends BaseCardFilterState>({
  cards,
  filter,
  setFilter,
  activeCount,
  active,
  onReset,
  extra,
}: CardFiltersProps<F>) {
  const { t } = useTranslation();

  const bankOptions = useMemo(() => collectCardBanks(cards), [cards]);
  const featureOptions = useMemo(() => collectCardFeatures(cards), [cards]);
  const bonusOptions = useMemo(() => collectCardBonuses(cards), [cards]);
  const paymentOptions = useMemo(() => collectCardPaymentSystems(cards), [cards]);
  const categoryOptions = useMemo(() => collectCardCategories(cards), [cards]);

  return (
    <FiltersBar
      activeCount={activeCount}
      canReset={active}
      onReset={onReset}
      search={
        <SearchInput
          value={filter.search}
          onChange={(search) => setFilter((f) => ({ ...f, search }))}
          placeholder={t("ratings.cards.search_placeholder")}
        />
      }
    >
      <MultiSelectFilter
        label={t("ratings.cards.bank")}
        searchPlaceholder={t("ratings.cards.search_bank")}
        options={bankOptions}
        selected={filter.banks}
        onChange={(banks) => setFilter((f) => ({ ...f, banks }))}
        variant="icon"
      />
      {extra}
      <MultiSelectFilter
        label={t("ratings.cards.features")}
        searchPlaceholder={t("ratings.search")}
        options={featureOptions}
        selected={filter.features}
        onChange={(features) => setFilter((f) => ({ ...f, features }))}
        variant="icon"
      />
      <MultiSelectFilter
        label={t("ratings.cards.bonuses")}
        searchPlaceholder={t("ratings.search")}
        options={bonusOptions}
        selected={filter.bonuses}
        onChange={(bonuses) => setFilter((f) => ({ ...f, bonuses }))}
        variant="icon"
      />
      <MultiSelectFilter
        label={t("ratings.cards.payment_system")}
        options={paymentOptions}
        selected={filter.paymentSystems}
        onChange={(paymentSystems) => setFilter((f) => ({ ...f, paymentSystems }))}
        variant="icon"
        searchable={false}
      />
      <MultiSelectFilter<CardCategory>
        label={t("ratings.cards.category")}
        options={categoryOptions}
        selected={filter.categories}
        onChange={(categories) => setFilter((f) => ({ ...f, categories }))}
        variant="icon"
        searchable={false}
      />
    </FiltersBar>
  );
}

/** Подпись «Категория» в карточке — общая для обоих разделов карт. */
export const CardCategoryRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="text-lightGray">{label}</span>
    <span className="text-white font-medium text-right">{value}</span>
  </div>
);
