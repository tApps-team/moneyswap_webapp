import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  BankCredit,
  CREDIT_TERM_OPTIONS,
  CreditTermBucket,
  orDash,
  useGetBankCreditsQuery,
} from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  FiltersBar,
  MultiSelectFilter,
  RatingValue,
  SearchInput,
  SortChips,
  VipBadge,
} from "@/shared/ui/ratings";
import { AgentDrawer, AgentSpecRow } from "@/widgets/ratings/agent-drawer";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import {
  CreditsFilterState,
  CreditsSortKey,
  EMPTY_CREDITS_FILTER,
  collectCreditBanks,
  countCreditsFilters,
  filterCredits,
  isCreditsFilterActive,
  sortCredits,
} from "../lib/filter";

interface CreditsExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

export const CreditsExplorer: FC<CreditsExplorerProps> = ({
  openedSlug,
  onOpenItem,
  onCloseItem,
}) => {
  const { t } = useTranslation();
  const { data: credits = [], isLoading, isError } = useGetBankCreditsQuery();

  const explorer = useExplorer<BankCredit, CreditsFilterState, CreditsSortKey>({
    items: credits,
    emptyFilter: EMPTY_CREDITS_FILTER,
    filterFn: filterCredits,
    sortFn: sortCredits,
    isActiveFn: isCreditsFilterActive,
    countFn: countCreditsFilters,
  });

  const bankOptions = useMemo(() => collectCreditBanks(credits), [credits]);

  const opened = openedSlug ? credits.find((credit) => credit.slug === openedSlug) : undefined;

  return (
    <>
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
            <FiltersBar
              activeCount={explorer.activeCount}
              canReset={explorer.active}
              onReset={explorer.reset}
              search={
                <SearchInput
                  value={explorer.filter.search}
                  onChange={(search) => explorer.setFilter((f) => ({ ...f, search }))}
                  placeholder={t("ratings.cards.search_placeholder")}
                />
              }
            >
              <MultiSelectFilter
                label={t("ratings.cards.bank")}
                searchPlaceholder={t("ratings.cards.search_bank")}
                options={bankOptions}
                selected={explorer.filter.banks}
                onChange={(banks) => explorer.setFilter((f) => ({ ...f, banks }))}
                variant="icon"
              />
              <MultiSelectFilter<CreditTermBucket>
                label={t("ratings.credits.term")}
                options={CREDIT_TERM_OPTIONS}
                selected={explorer.filter.terms}
                onChange={(terms) => explorer.setFilter((f) => ({ ...f, terms }))}
                variant="icon"
                searchable={false}
              />
              <SearchInput
                value={explorer.filter.minAmount}
                onChange={(minAmount) => explorer.setFilter((f) => ({ ...f, minAmount }))}
                placeholder={t("ratings.credits.amount_placeholder")}
                className="flex-none"
              />
            </FiltersBar>

            <SortChips
              options={[
                { key: "rate", label: t("ratings.credits.rate") },
                { key: "amount", label: t("ratings.credits.amount") },
                { key: "term", label: t("ratings.credits.term") },
                { key: "rating", label: t("ratings.rating") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((credit) => (
          <CreditItem key={credit.id} credit={credit} onOpen={onOpenItem} />
        ))}
      </ExplorerLayout>

      {opened && (
        <AgentDrawer
          isOpen
          onClose={onCloseItem}
          title={`${opened.bank?.title ? `${opened.bank.title} — ` : ""}${opened.name}`}
          name={opened.name}
          logo={opened.logo ?? opened.bank?.logo ?? null}
          headline={
            <span className="text-lightGray">
              {t("ratings.credits.rate")}:{" "}
              <span className="text-white">{orDash(opened.rate)}</span>
            </span>
          }
          description={opened.description}
          actionLabel={t("ratings.apply")}
          url={opened.url}
          specs={buildCreditSpecs(opened, t)}
          about={opened.about}
        />
      )}
    </>
  );
};

const CreditItem: FC<{ credit: BankCredit; onOpen: (slug: string) => void }> = ({
  credit,
  onOpen,
}) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        credit.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {credit.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={credit.name}
          logo={credit.logo ?? credit.bank?.logo ?? null}
          subtitle={credit.bank?.title}
          onOpen={() => onOpen(credit.slug)}
          className="flex-1"
        />
        <RatingValue rating={credit.rating} reviewsCount={credit.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label={t("ratings.credits.rate")} value={orDash(credit.rate)} />
        <Field label={t("ratings.credits.amount")} value={orDash(credit.amount)} />
        <Field label={t("ratings.credits.term")} value={orDash(credit.term)} />
        <Field label={t("ratings.credits.psk")} value={orDash(credit.psk)} />
      </div>

      <ActionButtons
        onDetails={() => onOpen(credit.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.apply")}
        url={credit.url}
      />
    </article>
  );
};

function buildCreditSpecs(credit: BankCredit, t: (key: string) => string): AgentSpecRow[] {
  return [
    { label: t("ratings.cards.bank"), value: orDash(credit.bank?.title) },
    { label: t("ratings.credits.rate"), value: orDash(credit.rate) },
    { label: t("ratings.credits.psk"), value: orDash(credit.psk) },
    { label: t("ratings.credits.amount"), value: orDash(credit.amount) },
    { label: t("ratings.credits.term"), value: orDash(credit.term) },
  ];
}
