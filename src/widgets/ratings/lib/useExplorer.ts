import { useEffect, useMemo, useState } from "react";
import { SortState, nextSortState } from "@/shared/ui/ratings";

export const PAGE_SIZE = 10;

interface UseExplorerArgs<T, F, K extends string> {
  items: T[];
  emptyFilter: F;
  filterFn: (items: T[], filter: F) => T[];
  sortFn: (items: T[], sort: SortState<K> | null) => T[];
  isActiveFn: (filter: F) => boolean;
  countFn: (filter: F) => number;
}

/**
 * Общая обвязка explorer'а раздела: состояние фильтра/сортировки/страницы.
 * Сами функции фильтрации и сортировки у каждого раздела свои — они перенесены
 * с сайта без изменений, чтобы выдача совпадала.
 */
export function useExplorer<T, F, K extends string>({
  items,
  emptyFilter,
  filterFn,
  sortFn,
  isActiveFn,
  countFn,
}: UseExplorerArgs<T, F, K>) {
  const [filter, setFilter] = useState<F>(emptyFilter);
  const [sort, setSort] = useState<SortState<K> | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterFn(items, filter), [items, filter, filterFn]);
  const sorted = useMemo(() => sortFn(filtered, sort), [filtered, sort, sortFn]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page],
  );

  // Любое изменение фильтра или сортировки возвращает на первую страницу.
  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const handleSort = (key: K) => setSort((prev) => nextSortState(prev, key));

  const reset = () => {
    setFilter(emptyFilter);
    setSort(null);
  };

  return {
    filter,
    setFilter,
    sort,
    handleSort,
    reset,
    page,
    setPage,
    totalPages,
    visible,
    total: sorted.length,
    active: isActiveFn(filter),
    activeCount: countFn(filter),
  };
}
