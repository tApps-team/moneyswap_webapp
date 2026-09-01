import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";
import { SortState } from "./sort-state";

interface SortChipsProps<K extends string> {
  options: { key: K; label: string }[];
  sort: SortState<K> | null;
  onSort: (key: K) => void;
  className?: string;
}

/** Ряд сортировки: горизонтальный скролл, чтобы влезли 4-5 колонок. */
export function SortChips<K extends string>({
  options,
  sort,
  onSort,
  className,
}: SortChipsProps<K>) {
  return (
    <div className={cn("flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar", className)}>
      {options.map(({ key, label }) => {
        const active = sort?.key === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              handleVibration();
              onSort(key);
            }}
            className={cn(
              "flex items-center gap-1.5 h-10 px-3 shrink-0 whitespace-nowrap rounded-[12px] border text-sm",
              active
                ? "border-mainColor/70 bg-mainColor/10 text-mainColor"
                : "border-new-grey/60 bg-new-dark-grey text-lightGray",
            )}
          >
            {label}
            {active ? (
              sort?.dir === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              )
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
            )}
          </button>
        );
      })}
    </div>
  );
}

