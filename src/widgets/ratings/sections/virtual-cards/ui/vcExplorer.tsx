import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MarketType,
  VirtualCard,
  formatVcIssuance,
  useGetVirtualCardsQuery,
} from "@/entities/strapi";
import {
  FiltersBar,
  MarketTabs,
  MultiSelectFilter,
  SearchInput,
  SortChips,
  TagCell,
} from "@/shared/ui/ratings";
import { AgentDrawer, AgentSpecRow } from "@/widgets/ratings/agent-drawer";
import { ExplorerLayout } from "@/widgets/ratings/lib/explorerLayout";
import { useExplorer } from "@/widgets/ratings/lib/useExplorer";
import {
  EMPTY_VC_FILTER,
  VcFilterState,
  VcSortKey,
  collectVcPlatforms,
  countVcFilters,
  filterVirtualCards,
  isVcFilterActive,
  sortVirtualCards,
} from "../lib/filter";
import { VcCard } from "./vcCard";

interface VcExplorerProps {
  openedSlug: string | null;
  onOpenItem: (slug: string) => void;
  onCloseItem: () => void;
}

export const VcExplorer: FC<VcExplorerProps> = ({ openedSlug, onOpenItem, onCloseItem }) => {
  const { t } = useTranslation();
  const [market, setMarket] = useState<MarketType>("international");
  const { data: cards = [], isLoading, isError } = useGetVirtualCardsQuery(market);

  const explorer = useExplorer<VirtualCard, VcFilterState, VcSortKey>({
    items: cards,
    emptyFilter: EMPTY_VC_FILTER,
    filterFn: filterVirtualCards,
    sortFn: sortVirtualCards,
    isActiveFn: isVcFilterActive,
    countFn: countVcFilters,
  });

  const platformOptions = useMemo(() => collectVcPlatforms(cards), [cards]);

  const opened = openedSlug ? cards.find((card) => card.slug === openedSlug) : undefined;

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
                  value={explorer.filter.search}
                  onChange={(search) => explorer.setFilter((f) => ({ ...f, search }))}
                  placeholder={t("ratings.search_by_name")}
                />
              }
            >
              <MultiSelectFilter
                label={t("ratings.vc.platforms")}
                searchPlaceholder={t("ratings.ps.search_service")}
                options={platformOptions}
                selected={explorer.filter.platforms}
                onChange={(platforms) => explorer.setFilter((f) => ({ ...f, platforms }))}
                variant="icon"
              />
            </FiltersBar>

            <SortChips
              options={[
                { key: "issuance", label: t("ratings.vc.issuance") },
                { key: "topup", label: t("ratings.vc.topup") },
              ]}
              sort={explorer.sort}
              onSort={explorer.handleSort}
            />
          </>
        }
      >
        {explorer.visible.map((card) => (
          <VcCard key={card.id} card={card} onOpen={onOpenItem} />
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
              {t("ratings.vc.issuance")}:{" "}
              <span className="text-white">{formatVcIssuance(opened)}</span>
            </span>
          }
          actionLabel={t("ratings.issue")}
          url={opened.url}
          specs={buildVcSpecs(opened, t)}
          promocodes={opened.promocodes}
          about={opened.about}
        />
      )}
    </>
  );
};

function buildVcSpecs(card: VirtualCard, t: (key: string) => string): AgentSpecRow[] {
  return [
    { label: t("ratings.vc.issuance"), value: formatVcIssuance(card) },
    { label: t("ratings.vc.topup"), value: card.topup_commission || "—" },
    { label: t("ratings.vc.maintenance"), value: card.maintenance_info || "—" },
    {
      label: t("ratings.vc.platforms"),
      value: (
        <TagCell
          items={card.platforms}
          modalTitle={t("ratings.vc.platforms")}
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.ps.payment_methods"),
      value: (
        <TagCell
          items={card.payment_systems}
          modalTitle={t("ratings.ps.payment_methods")}
          chip="icon"
          className="justify-end"
        />
      ),
    },
    {
      label: t("ratings.countries"),
      value: (
        <TagCell
          items={card.countries}
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
          items={card.currencies}
          modalTitle={t("ratings.currencies")}
          chip="code"
          className="justify-end"
        />
      ),
    },
  ];
}
