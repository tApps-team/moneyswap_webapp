import { FC, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";
import { useDrawerBackButton } from "@/shared/hooks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import { ScrollArea } from "../scroll-area";

export interface TagItem {
  id: number;
  title: string;
  icon?: string | null;
  code?: string;
}

export type TagChipVariant = "circle" | "icon" | "flag" | "code";

interface TagCellProps {
  items: TagItem[];
  modalTitle: string;
  visibleCount?: number;
  chip?: TagChipVariant;
  className?: string;
}

/**
 * Ряд иконок с чипом «+N»: по тапу открывает диалог с полным списком.
 * Приоритет 2 у кнопки «Назад» — диалог может открываться поверх drawer'а агента.
 */
export const TagCell: FC<TagCellProps> = ({
  items,
  modalTitle,
  visibleCount = 3,
  chip = "icon",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useDrawerBackButton({
    isOpen,
    onClose: () => setIsOpen(false),
    priority: 2,
  });

  if (!items.length) {
    return <span className="text-lightGray text-sm">—</span>;
  }

  const visible = items.slice(0, visibleCount);
  const extra = items.length - visible.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        aria-label={`${modalTitle}: ${items.length}`}
        onClick={() => {
          handleVibration();
          setIsOpen(true);
        }}
        className={cn(
          "flex items-center gap-1.5 flex-wrap min-w-0 text-left rounded-lg active:opacity-70",
          className,
        )}
      >
        {visible.map((item) => (
          <VisibleChip key={item.id} item={item} chip={chip} />
        ))}
        {extra > 0 && (
          <span className="flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-md bg-new-grey text-xs text-lightGray">
            +{extra}
          </span>
        )}
      </button>

      <DialogContent className="flex flex-col gap-4 bg-new-dark-grey border-none rounded-[16px] p-5 w-[92vw] max-w-[440px]">
        <DialogTitle className="m-0 pr-6 text-mainColor uppercase text-base font-semibold">
          {modalTitle}
        </DialogTitle>
        <DialogDescription className="sr-only">{modalTitle}</DialogDescription>

        <ScrollArea className="max-h-[60dvh] -mr-3 pr-3 overflow-auto">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-[10px] bg-new-grey px-3 py-2"
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.title}
                    loading="lazy"
                    width={20}
                    height={20}
                    className={cn(
                      "w-5 h-5 shrink-0 rounded-full",
                      chip === "flag" ? "object-cover" : "object-contain",
                    )}
                  />
                )}
                <span className="text-white text-xs">{item.title}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

function VisibleChip({ item, chip }: { item: TagItem; chip: TagChipVariant }) {
  if (chip === "code") {
    return (
      <span className="px-2 py-1 rounded-md bg-new-grey text-2xs text-lightGray uppercase">
        {item.code ?? item.title}
      </span>
    );
  }

  if (!item.icon) {
    return (
      <span className="px-2 py-1 rounded-md bg-new-grey text-2xs text-lightGray truncate max-w-[110px]">
        {item.title}
      </span>
    );
  }

  return (
    <img
      src={item.icon}
      alt={item.title}
      loading="lazy"
      width={28}
      height={28}
      title={item.title}
      className={cn(
        "w-7 h-7 shrink-0 rounded-full",
        chip === "flag" ? "object-cover" : "object-contain",
      )}
    />
  );
}
