import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  MICROLOAN_AMOUNT_OPTIONS,
  MICROLOAN_DURATION_OPTIONS,
  MICROLOAN_FIRST_LOAN_OPTIONS,
  MICROLOAN_LIMIT_OPTIONS,
  MICROLOAN_TERM_OPTIONS,
  // MICROLOAN_VERIFICATION_OPTIONS, // фильтр «Проверка условий» скрыт
  Microloan,
  MicroloanAmountType,
  MicroloanDurationType,
  MicroloanFirstLoanType,
  MicroloanLimitType,
  MicroloanTermType,
  // MicroloanVerificationStatus, // фильтр «Проверка условий» скрыт
  formatApproval,
  formatFirstLoanType,
  formatMicroloanLimit,
  formatMicroloanTerm,
  orDash,
  useGetMicroloansQuery,
} from "@/entities/strapi";
import {
  ActionButtons,
  EntityIdentity,
  Field,
  FiltersBar,
  LabeledTags,
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
  EMPTY_MFO_FILTER,
  MfoFilterState,
  MfoSortKey,
  collectMfoChannels,
  countMfoFilters,
  filterMicroloans,
  isMfoFilterActive,
  keepPresent,
  sortMicroloans,
} from "../lib/filter";

interface MfoExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

export const MfoExplorer: FC<MfoExplorerProps> = ({ openedSlug, onOpenItem, onCloseItem }) => {
  const { t } = useTranslation();
  const { data: loans = [], isLoading, isError } = useGetMicroloansQuery();

  const explorer = useExplorer<Microloan, MfoFilterState, MfoSortKey>({
    items: loans,
    emptyFilter: EMPTY_MFO_FILTER,
    filterFn: filterMicroloans,
    sortFn: sortMicroloans,
    isActiveFn: isMfoFilterActive,
    countFn: countMfoFilters,
  });

  const channelOptions = useMemo(() => collectMfoChannels(loans), [loans]);
  const amountOptions = useMemo(
    () => keepPresent(MICROLOAN_AMOUNT_OPTIONS, loans.map((loan) => loan.loan_amount_type)),
    [loans],
  );
  const termOptions = useMemo(
    () => keepPresent(MICROLOAN_TERM_OPTIONS, loans.map((loan) => loan.loan_term_type)),
    [loans],
  );
  const firstLoanOptions = useMemo(
    () => keepPresent(MICROLOAN_FIRST_LOAN_OPTIONS, loans.map((loan) => loan.first_loan_type)),
    [loans],
  );
  // Фильтр «Проверка условий» скрыт по просьбе заказчика. Логика фильтрации в lib/filter.ts
  // оставлена нетронутой, поэтому вернуть его — раскомментировать этот блок и разметку ниже.
  // const verificationOptions = useMemo(
  //   () => keepPresent(MICROLOAN_VERIFICATION_OPTIONS, loans.map((loan) => loan.verification_status)),
  //   [loans],
  // );
  const limitTypeOptions = useMemo(
    () => keepPresent(MICROLOAN_LIMIT_OPTIONS, loans.map((loan) => loan.loan_limit_type)),
    [loans],
  );
  const durationTypeOptions = useMemo(
    () => keepPresent(MICROLOAN_DURATION_OPTIONS, loans.map((loan) => loan.loan_duration_type)),
    [loans],
  );

  const opened = openedSlug ? loans.find((loan) => loan.slug === openedSlug) : undefined;

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
                  placeholder={t("ratings.mfo.search_placeholder")}
                />
              }
            >
              <MultiSelectFilter<MicroloanAmountType>
                label={t("ratings.mfo.amount")}
                options={amountOptions}
                selected={explorer.filter.amounts}
                onChange={(amounts) => explorer.setFilter((f) => ({ ...f, amounts }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter<MicroloanTermType>
                label={t("ratings.mfo.term")}
                options={termOptions}
                selected={explorer.filter.terms}
                onChange={(terms) => explorer.setFilter((f) => ({ ...f, terms }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter<MicroloanFirstLoanType>
                label={t("ratings.mfo.first_loan")}
                options={firstLoanOptions}
                selected={explorer.filter.firstLoan}
                onChange={(firstLoan) => explorer.setFilter((f) => ({ ...f, firstLoan }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter
                label={t("ratings.mfo.channels")}
                options={channelOptions}
                selected={explorer.filter.channels}
                onChange={(channels) => explorer.setFilter((f) => ({ ...f, channels }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter<MicroloanLimitType>
                label={t("ratings.mfo.limit_type")}
                options={limitTypeOptions}
                selected={explorer.filter.limitTypes}
                onChange={(limitTypes) => explorer.setFilter((f) => ({ ...f, limitTypes }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter<MicroloanDurationType>
                label={t("ratings.mfo.duration_type")}
                options={durationTypeOptions}
                selected={explorer.filter.durationTypes}
                onChange={(durationTypes) => explorer.setFilter((f) => ({ ...f, durationTypes }))}
                variant="icon"
                searchable={false}
              />
              {/* Фильтр «Проверка условий» скрыт — см. комментарий у verificationOptions выше.
              <MultiSelectFilter<MicroloanVerificationStatus>
                label={t("ratings.mfo.verification")}
                options={verificationOptions}
                selected={explorer.filter.verification}
                onChange={(verification) => explorer.setFilter((f) => ({ ...f, verification }))}
                variant="icon"
                searchable={false}
              /> */}
            </FiltersBar>

            <SortChips
              options={[
                { key: "rate", label: t("ratings.mfo.rate") },
                { key: "limit", label: t("ratings.mfo.limit") },
                { key: "term", label: t("ratings.mfo.term") },
                { key: "rating", label: t("ratings.rating") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((loan) => (
          <MfoItem key={loan.id} loan={loan} onOpen={onOpenItem} />
        ))}
      </ExplorerLayout>

      {opened && (
        <AgentDrawer
          isOpen
          onClose={onCloseItem}
          title={opened.name}
          name={opened.name}
          logo={opened.logo}
          headline={
            <span className="text-lightGray">
              {t("ratings.mfo.rate")}: <span className="text-white">{orDash(opened.rate)}</span>
            </span>
          }
          description={opened.description}
          actionLabel={t("ratings.receive")}
          url={opened.url}
          specs={buildMfoSpecs(opened, t)}
          about={opened.about}
        />
      )}
    </>
  );
};

const MfoItem: FC<{ loan: Microloan; onOpen: (slug: string) => void }> = ({ loan, onOpen }) => {
  const { t } = useTranslation();

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-3 bg-new-dark-grey rounded-[16px] p-4 min-w-0",
        loan.is_vip ? "border border-mainColor/40" : "border border-new-grey/50",
      )}
    >
      {loan.is_vip && <VipBadge label={t("ratings.best_offer")} className="-top-2.5 right-4" />}

      <div className="flex items-start justify-between gap-3 min-w-0">
        <EntityIdentity
          name={loan.name}
          logo={loan.logo}
          onOpen={() => onOpen(loan.slug)}
          className="flex-1"
        />
        <RatingValue rating={loan.rating} reviewsCount={loan.reviews_count} compact />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label={t("ratings.mfo.limit")} value={formatMicroloanLimit(loan)} />
        <Field label={t("ratings.mfo.term")} value={formatMicroloanTerm(loan)} />
        <Field label={t("ratings.mfo.rate")} value={orDash(loan.rate)} />
        <Field label={t("ratings.mfo.psk")} value={orDash(loan.psk)} />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-lightGray">{t("ratings.mfo.first_loan")}</span>
        <span className="text-white font-medium text-right">
          {formatFirstLoanType(loan.first_loan_type)}
        </span>
      </div>

      <LabeledTags label={t("ratings.mfo.channels")} items={loan.issue_channels} chip="icon" />

      <ActionButtons
        onDetails={() => onOpen(loan.slug)}
        detailLabel={t("ratings.details")}
        actionLabel={t("ratings.receive")}
        url={loan.url}
      />
    </article>
  );
};

function buildMfoSpecs(loan: Microloan, t: (key: string) => string): AgentSpecRow[] {
  return [
    { label: t("ratings.mfo.limit"), value: formatMicroloanLimit(loan) },
    { label: t("ratings.mfo.term"), value: formatMicroloanTerm(loan) },
    { label: t("ratings.mfo.rate"), value: orDash(loan.rate) },
    { label: t("ratings.mfo.psk"), value: orDash(loan.psk) },
    { label: t("ratings.mfo.approval"), value: formatApproval(loan.approval) },
    { label: t("ratings.mfo.first_loan"), value: formatFirstLoanType(loan.first_loan_type) },
  ];
}
