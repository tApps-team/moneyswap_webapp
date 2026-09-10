export type SortDir = "asc" | "desc";

export interface SortState<K extends string> {
  key: K;
  dir: SortDir;
}

/** Переключение направления по клику: asc → desc → сброс. */
export function nextSortState<K extends string>(
  prev: SortState<K> | null,
  key: K,
): SortState<K> | null {
  if (prev?.key !== key) return { key, dir: "asc" };
  if (prev.dir === "asc") return { key, dir: "desc" };
  return null;
}
