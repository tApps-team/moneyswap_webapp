import { FC } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { handleVibration } from "@/shared/lib";

export type MarketTabValue = "international" | "russian";

interface MarketTabsProps {
  value: MarketTabValue;
  onChange: (value: MarketTabValue) => void;
  className?: string;
}

/**
 * Переключатель рынка для eSIM и виртуальных карт.
 *
 * На сайте рынок задаётся скрытым `?market=`, видимого переключателя нет,
 * из-за чего российские предложения фактически недоступны. В мини-аппе делаем его явным.
 */
export const MarketTabs: FC<MarketTabsProps> = ({ value, onChange, className }) => {
  const { t } = useTranslation();

  const tabs: { value: MarketTabValue; label: string }[] = [
    { value: "international", label: t("ratings.market.international") },
    { value: "russian", label: t("ratings.market.russian") },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-2 min-w-0", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => {
            handleVibration();
            onChange(tab.value);
          }}
          className={cn(
            "h-11 rounded-[12px] px-3 text-sm font-medium truncate active:opacity-80",
            value === tab.value
              ? "bg-mainColor text-black"
              : "bg-new-light-grey text-white",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
