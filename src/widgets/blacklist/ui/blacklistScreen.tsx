import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Loader, ShieldAlert } from "lucide-react";
import { BlacklistItem, useGetBlacklistQuery } from "@/entities/blacklist";
import { CollapsibleBlock, SearchInput, SectionHeader } from "@/shared/ui/ratings";
import { handleVibration } from "@/shared/lib";
import { BlacklistDrawer } from "./blacklistDrawer";

/** Ключи предупреждающих блоков — тексты те же, что на /blacklist сайта. */
const TIP_KEYS = ["scam", "detect", "avoid", "victim"] as const;

export const BlacklistScreen = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState<BlacklistItem | null>(null);
  const { data: items = [], isLoading, isError } = useGetBlacklistQuery();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      `${item.exchangerName?.ru ?? ""} ${item.exchangerName?.en ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  return (
    <section className="grid gap-4 min-w-0">
      <SectionHeader title={t("blacklist.title")} subtitle={t("blacklist.subtitle")} />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={t("ratings.search_by_name")}
        className="w-full"
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader className="animate-spin size-6 text-mainColor" />
        </div>
      ) : isError ? (
        <div className="py-10 px-4 text-center bg-new-dark-grey rounded-[16px] border border-new-grey/60">
          <p className="text-lightGray text-sm">{t("ratings.load_error")}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 px-4 text-center bg-new-dark-grey rounded-[16px] border border-new-grey/60">
          <p className="text-lightGray text-sm">{t("ratings.not_found")}</p>
        </div>
      ) : (
        <div className="grid gap-2 min-w-0">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                handleVibration();
                setOpened(item);
              }}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full min-w-0 rounded-[12px] border border-new-grey/50 bg-new-dark-grey p-3 text-left active:opacity-80"
            >
              <span className="grid place-items-center size-9 shrink-0 rounded-full bg-new-grey text-red-500">
                <ShieldAlert className="size-4" />
              </span>
              <span className="text-sm text-white break-words min-w-0">
                {item.exchangerName?.ru || item.exchangerName?.en}
              </span>
              <ChevronRight className="size-4 shrink-0 text-lightGray" />
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-2 min-w-0">
        {TIP_KEYS.map((key) => (
          <CollapsibleBlock key={key} title={t(`blacklist.tips.${key}.title`)}>
            <div className="rounded-[12px] bg-new-dark-grey p-4">
              <p className="text-xs text-lightGray leading-relaxed whitespace-pre-line">
                {t(`blacklist.tips.${key}.text`)}
              </p>
            </div>
          </CollapsibleBlock>
        ))}
      </div>

      {opened && <BlacklistDrawer item={opened} onClose={() => setOpened(null)} />}
    </section>
  );
};
