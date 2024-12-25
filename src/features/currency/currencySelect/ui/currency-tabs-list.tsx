import { CurrencyValutes } from "@/entities/currency";
import { Lang } from "@/shared/config";
import { TabsList, TabsTrigger } from "@/shared/ui";
import { FC, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface CurrencyTabsListProps {
  setTabHeight: (height: number) => void;
  filteredCurrencies: CurrencyValutes[];
}

export const CurrencyTabsList: FC<CurrencyTabsListProps> = ({
  setTabHeight,
  filteredCurrencies,
}) => {
  const { i18n } = useTranslation();
  const tabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (tabRef.current) {
        const tabHeight = tabRef.current.getBoundingClientRect().height;
        setTabHeight(tabHeight);
      }
    };

    updateHeight();
    console.log("rerender");

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [filteredCurrencies]);

  return (
    <TabsList
      ref={tabRef}
      data-vaul-no-drag
      className="bg-transparent flex px-5 py-0 flex-wrap justify-start gap-2 w-full h-full "
    >
      {filteredCurrencies?.map((tab) => (
        <TabsTrigger
          key={tab?.id}
          className={
            "font-normal rounded-[7px] py-1 w-fit max-w-48 bg-new-tabs-grey min-w-16 data-[state=active]:text-black data-[state=active]:border-mainColor text-white h-[26px] data-[state=active]:bg-mainColor"
          }
          value={tab?.name?.[i18n.language as Lang] || ""}
        >
          <p className="truncate leading-0 font-medium text-xs">
            {tab?.name?.[i18n.language as Lang]}
          </p>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
