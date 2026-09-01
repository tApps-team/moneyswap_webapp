import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentService,
  formatCommission,
  formatReviewsCount,
  useGetPaymentServicesQuery,
} from "@/entities/strapi";
import {
  FiltersBar,
  MultiSelectFilter,
  SearchInput,
  SortChips,
  TagCell,
} from "@/shared/ui/ratings";
import { AgentDrawer, AgentSpecRow } from "@/widgets/ratings/agent-drawer";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import {
  EMPTY_PS_FILTER,
  PsFilterState,
  PsSortKey,
  collectPsCurrencies,
  collectPsGames,
  collectPsPaymentSystems,
  collectPsServices,
  countPsFilters,
  filterPaymentServices,
  isPsFilterActive,
  sortPaymentServices,
} from "../lib/filter";
import { PsCard } from "./psCard";

interface PsExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

export const PsExplorer: FC<PsExplorerProps> = ({ openedSlug, onOpenItem, onCloseItem }) => {
  const { t } = useTranslation();
  const { data: services = [], isLoading, isError } = useGetPaymentServicesQuery();

  const explorer = useExplorer<PaymentService, PsFilterState, PsSortKey>({
    items: services,
    emptyFilter: EMPTY_PS_FILTER,
    filterFn: filterPaymentServices,
    sortFn: sortPaymentServices,
    isActiveFn: isPsFilterActive,
    countFn: countPsFilters,
  });

  const serviceOptions = useMemo(() => collectPsServices(services), [services]);
  const gameOptions = useMemo(() => collectPsGames(services), [services]);
  const paymentOptions = useMemo(() => collectPsPaymentSystems(services), [services]);
  const currencyOptions = useMemo(() => collectPsCurrencies(services), [services]);

  const opened = openedSlug ? services.find((service) => service.slug === openedSlug) : undefined;

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
                  placeholder={t("ratings.search_by_name")}
                />
              }
            >
              <MultiSelectFilter
                label={t("ratings.ps.services")}
                searchPlaceholder={t("ratings.ps.search_service")}
                options={serviceOptions}
                selected={explorer.filter.services}
                onChange={(items) => explorer.setFilter((f) => ({ ...f, services: items }))}
                variant="icon"
              />
              <MultiSelectFilter
                label={t("ratings.ps.games")}
                searchPlaceholder={t("ratings.ps.search_game")}
                options={gameOptions}
                selected={explorer.filter.games}
                onChange={(games) => explorer.setFilter((f) => ({ ...f, games }))}
                variant="icon"
              />
              <MultiSelectFilter
                label={t("ratings.ps.payment_method")}
                options={paymentOptions}
                selected={explorer.filter.paymentSystems}
                onChange={(paymentSystems) => explorer.setFilter((f) => ({ ...f, paymentSystems }))}
                variant="icon"
                searchable={false}
              />
              <MultiSelectFilter
                label={t("ratings.currencies")}
                searchPlaceholder={t("ratings.search_currency")}
                options={currencyOptions}
                selected={explorer.filter.currencies}
                onChange={(currencies) => explorer.setFilter((f) => ({ ...f, currencies }))}
                variant="code"
              />
            </FiltersBar>

            <SortChips
              options={[
                { key: "commission", label: t("ratings.ps.commission") },
                { key: "platforms", label: t("ratings.ps.platforms") },
                { key: "rating", label: t("ratings.rating") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((service) => (
          <PsCard key={service.id} service={service} onOpen={onOpenItem} />
        ))}
      </ExplorerLayout>

      {opened && (
        <AgentDrawer
          isOpen
          onClose={onCloseItem}
          title={t("ratings.ps.detail_title", { name: opened.name })}
          name={opened.name}
          logo={opened.logo}
          headline={
            <>
              <span className="text-lightGray">
                {t("ratings.ps.commission")}:{" "}
                <span className="text-white">{formatCommission(opened)}</span>
              </span>
              {opened.rating ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-mainColor font-semibold">{opened.rating.toFixed(1)}</span>
                  {opened.reviews_count ? (
                    <span className="text-lightGray">{formatReviewsCount(opened.reviews_count)}</span>
                  ) : null}
                </span>
              ) : null}
            </>
          }
          description={opened.description}
          actionLabel={t("ratings.go_to_site")}
          url={opened.url}
          specs={buildPsSpecs(opened, t)}
          promocodes={opened.promocodes}
          about={opened.about}
        />
      )}
    </>
  );
};

function buildPsSpecs(service: PaymentService, t: (key: string) => string): AgentSpecRow[] {
  return [
    { label: t("ratings.ps.commission"), value: formatCommission(service) },
    {
      label: t("ratings.ps.payment_methods"),
      value: (
        <TagCell
          items={service.payment_systems}
          modalTitle={t("ratings.ps.payment_methods")}
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.currencies"),
      value: (
        <TagCell
          items={service.currencies}
          modalTitle={t("ratings.currencies")}
          chip="code"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.ps.platforms"),
      value: (
        <TagCell
          items={service.platforms}
          modalTitle={t("ratings.ps.platforms")}
          chip="icon"
          className="justify-end"
        />
      ),
    },
  ];
}
