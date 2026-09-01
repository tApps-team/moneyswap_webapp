import { FC } from "react";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";

interface LocalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buildPages = (currentPage: number, totalPages: number): (number | "...")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

/** Клиентская пагинация (без роутинга) для отфильтрованных списков. */
export const LocalPagination: FC<LocalPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1">
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            type="button"
            onClick={() => {
              handleVibration();
              onPageChange(page);
            }}
            className={cn(
              "h-9 w-9 text-sm font-normal flex justify-center items-center rounded-[8px]",
              page === currentPage ? "bg-mainColor text-black" : "text-white bg-new-dark-grey",
            )}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            className="h-9 w-9 font-normal flex justify-center items-center text-white"
          >
            {page}
          </span>
        ),
      )}
    </div>
  );
};
