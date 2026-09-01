import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Esim,
  MarketType,
  formatEsimCalls,
  formatEsimInternetSharing,
  formatEsimPrice,
  formatEsimTopUp,
  formatEsimValidityPeriod,
  formatEsimVolume,
  useGetEsimsQuery,
} from "@/entities/strapi";
import { Switch } from "@/shared/ui";
import {
  FiltersBar,
  MarketTabs,
  MultiSelectFilter,
  SearchInput,
  SortChips,
  TagCell,
} from "@/shared/ui/ratings";
import { handleVibration } from "@/shared/lib";
import { AgentDrawer, AgentSpecRow } from "@/widgets/ratings/agent-drawer";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import {
  EMPTY_ESIM_FILTER,
  EsimFilterState,
  EsimSortKey,
  collectEsimCountries,
  countEsimFilters,
  filterEsims,
  isEsimFilterActive,
  sortEsims,
} from "../lib/filter";
import { EsimCard } from "./esimCard";

interface EsimExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

type BoolKey = "sharing" | "calls" | "topUp";

export const EsimExplorer: FC<EsimExplorerProps> = ({ openedSlug, onOpenItem, onCloseItem }) => {
  const { t } = useTranslation();
  const [market, setMarket] = useState<MarketType>("international");
  const { data: services = [], isLoading, isError } = useGetEsimsQuery(market);

  const explorer = useExplorer<Esim, EsimFilterState, EsimSortKey>({
    items: services,
    emptyFilter: EMPTY_ESIM_FILTER,
    filterFn: filterEsims,
    sortFn: sortEsims,
    isActiveFn: isEsimFilterActive,
    countFn: countEsimFilters,
  });

  const countryOptions = useMemo(() => collectEsimCountries(services), [services]);

  const opened = openedSlug ? services.find((service) => service.slug === openedSlug) : undefined;

  const toggles: { key: BoolKey; label: string }[] = [
    { key: "sharing", label: t("ratings.esim.sharing") },
    { key: "calls", label: t("ratings.esim.calls") },
    { key: "topUp", label: t("ratings.esim.top_up") },
  ];

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
            <MarketTabs
              value={market}
              onChange={(value) => {
                setMarket(value);
                explorer.reset();
                onCloseItem();
              }}
            />

            <FiltersBar
              activeCount={explorer.activeCount}
              canReset={explorer.active}
              onReset={explorer.reset}
              search={
                <SearchInput
                  value={explorer.filter.minVolume}
                  onChange={(minVolume) => explorer.setFilter((f) => ({ ...f, minVolume }))}
                  placeholder={t("ratings.esim.min_volume_placeholder")}
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

              {toggles.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-3 h-12 px-4 rounded-[14px] border border-new-grey/60 bg-new-dark-grey text-sm text-white"
                >
                  <span className="truncate">{label}</span>
                  <Switch
                    checked={explorer.filter[key]}
                    onCheckedChange={(checked) => {
                      handleVibration();
                      explorer.setFilter((f) => ({ ...f, [key]: checked }));
                    }}
                  />
                </label>
              ))}
            </FiltersBar>

            <SortChips
              options={[
                { key: "price", label: t("ratings.esim.price") },
                { key: "volume", label: t("ratings.esim.volume") },
                { key: "period", label: t("ratings.esim.period") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((esim) => (
          <EsimCard key={esim.id} esim={esim} onOpen={onOpenItem} />
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
              {t("ratings.esim.price")}:{" "}
              <span className="text-white">{formatEsimPrice(opened.connection_price)}</span>
            </span>
          }
          actionLabel={t("ratings.go")}
          url={opened.url}
          specs={buildEsimSpecs(opened, t)}
          promocodes={opened.promocodes}
          about={opened.about}
        />
      )}
    </>
  );
};

function buildEsimSpecs(esim: Esim, t: (key: string) => string): AgentSpecRow[] {
  return [
    { label: t("ratings.esim.price"), value: formatEsimPrice(esim.connection_price) },
    { label: t("ratings.esim.volume"), value: formatEsimVolume(esim.internet_volume) },
    { label: t("ratings.esim.period"), value: formatEsimValidityPeriod(esim.validity_period) },
    { label: t("ratings.esim.sharing"), value: formatEsimInternetSharing(esim.internet_sharing) },
    { label: t("ratings.esim.calls"), value: formatEsimCalls(esim.calls) },
    { label: t("ratings.esim.top_up"), value: formatEsimTopUp(esim.top_up) },
    {
      label: t("ratings.ved.labels"),
      value: (
        <TagCell
          items={esim.labels}
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
          items={esim.countries}
          modalTitle={t("ratings.countries")}
          chip="flag"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.ps.payment_methods"),
      value: (
        <TagCell
          items={esim.payment_systems}
          modalTitle={t("ratings.ps.payment_methods")}
          chip="icon"
          className="justify-end"
        />
      ),
    },
  ];
}
