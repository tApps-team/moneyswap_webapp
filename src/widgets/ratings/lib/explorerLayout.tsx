import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import { EmptyResult, LocalPagination } from "@/shared/ui/ratings";

interface ExplorerLayoutProps {
  isLoading: boolean;
  isError: boolean;
  /** Панель фильтров и ряд сортировки. */
  controls: ReactNode;
  /** Карточки текущей страницы. */
  children: ReactNode;
  total: number;
  active: boolean;
  onReset: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyText?: string;
}

/** Общая раскладка списка раздела: загрузка → ошибка → фильтры + карточки + пагинация. */
export const ExplorerLayout: FC<ExplorerLayoutProps> = ({
  isLoading,
  isError,
  controls,
  children,
  total,
  active,
  onReset,
  page,
  totalPages,
  onPageChange,
  emptyText,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="animate-spin size-6 text-mainColor" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 px-4 text-center bg-new-dark-grey rounded-[16px] border border-new-grey/60">
        <p className="text-lightGray text-sm">{t("ratings.load_error")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 min-w-0">
      {controls}

      {total === 0 ? (
        <EmptyResult
          active={active}
          emptyText={emptyText ?? t("ratings.empty")}
          filteredText={t("ratings.empty_filtered")}
          resetText={t("ratings.reset")}
          onReset={onReset}
        />
      ) : (
        <div className="grid gap-4 min-w-0">{children}</div>
      )}

      {totalPages > 1 && (
        <LocalPagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
};
