import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  VedAgent,
  formatVedLimit,
  useGetVedAgentsQuery,
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
  EMPTY_VED_FILTER,
  VedFilterState,
  VedSortKey,
  collectCountries,
  collectCurrencies,
  countVedFilters,
  filterVedAgents,
  isVedFilterActive,
  sortVedAgents,
} from "../lib/filter";
import { VedCard } from "./vedCard";

interface VedExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

export const VedExplorer: FC<VedExplorerProps> = ({ openedSlug, onOpenItem, onCloseItem }) => {
  const { t } = useTranslation();
  const { data: agents = [], isLoading, isError } = useGetVedAgentsQuery();

  const explorer = useExplorer<VedAgent, VedFilterState, VedSortKey>({
    items: agents,
    emptyFilter: EMPTY_VED_FILTER,
    filterFn: filterVedAgents,
    sortFn: sortVedAgents,
    isActiveFn: isVedFilterActive,
    countFn: countVedFilters,
  });

  const countryOptions = useMemo(() => collectCountries(agents), [agents]);
  const currencyOptions = useMemo(
    () =>
      collectCurrencies(agents).map((currency) => ({
        id: currency.id,
        title: currency.code ? `${currency.code} — ${currency.title}` : currency.title,
        icon: currency.icon,
        code: currency.code,
      })),
    [agents],
  );

  const opened = openedSlug ? agents.find((agent) => agent.slug === openedSlug) : undefined;

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
                  value={explorer.filter.amount}
                  onChange={(amount) => explorer.setFilter((f) => ({ ...f, amount }))}
                  placeholder={t("ratings.ved.amount_placeholder")}
                />
              }
            >
              <MultiSelectFilter
                label={t("ratings.country")}
                searchPlaceholder={t("ratings.search_country")}
                options={countryOptions}
                selected={explorer.filter.countries}
                onChange={(countries) => explorer.setFilter((f) => ({ ...f, countries }))}
                variant="flag"
              />
              <MultiSelectFilter
                label={t("ratings.ved.payment_currency")}
                searchPlaceholder={t("ratings.search_currency")}
                options={currencyOptions}
                selected={explorer.filter.currencies}
                onChange={(currencies) => explorer.setFilter((f) => ({ ...f, currencies }))}
                variant="code"
              />
            </FiltersBar>

            <SortChips
              options={[
                { key: "commission", label: t("ratings.ved.sort_commission") },
                { key: "limitFrom", label: t("ratings.ved.sort_limit") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((agent) => (
          <VedCard key={agent.id} agent={agent} onOpen={onOpenItem} />
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
            <>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-mainColor/15 text-mainColor">
                {t("ratings.ved.from_commission", { value: opened.commission })}
              </span>
              <span className="text-lightGray">
                {t("ratings.from")}{" "}
                <span className="text-green-400">{formatVedLimit(opened.limits.from)}</span>{" "}
                {t("ratings.to").toLowerCase()}{" "}
                <span className="text-[#e8a090]">{formatVedLimit(opened.limits.to)}</span> USD
              </span>
            </>
          }
          actionLabel={t("ratings.contact")}
          url={opened.url}
          specs={buildVedSpecs(opened, t)}
          promocodes={opened.promocodes}
          about={opened.about}
        />
      )}
    </>
  );
};

function buildVedSpecs(agent: VedAgent, t: (key: string) => string): AgentSpecRow[] {
  return [
    {
      label: t("ratings.ved.labels"),
      value: (
        <TagCell
          items={agent.labels}
          modalTitle={t("ratings.ved.labels")}
          chip="circle"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.countries"),
      value: (
        <TagCell
          items={agent.countries}
          modalTitle={t("ratings.countries")}
          chip="flag"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.currencies"),
      value: (
        <TagCell
          items={agent.currencies}
          modalTitle={t("ratings.currencies")}
          chip="code"
          className="justify-end"
        />
      ),
    },
  ];
}
