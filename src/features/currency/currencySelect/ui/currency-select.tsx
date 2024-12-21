import {
  Currency,
  CurrencyCard,
  CurrencyCategory,
  CurrencyValutes,
} from "@/entities/currency";
import { SearchIcon } from "@/shared/assets";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Empty,
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cx } from "class-variance-authority";
import { X } from "lucide-react";

import { Lang } from "@/shared/config";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { filterCurrency, filterTabList } from "../lib/filter-currency";

type CurrecnySelectProps = {
  label: string;
  currencyInfo?: Partial<Omit<Currency, "id">>;
  disabled?: boolean;
  currencies?: CurrencyValutes[];
  emptyLabel?: string;
  onClick?: (currency: Currency) => void;
};

export const CurrencySelect = (props: CurrecnySelectProps) => {
  const { currencies, disabled, emptyLabel, onClick, currencyInfo, label } =
    props;

  const { i18n, t } = useTranslation();
  const allKey = t("ВСЕ");

  const [activeTab, setActiveTab] = useState<string>(allKey);

  const [searchValue, setSearchValue] = useState<string>("");
  const searchDeferredValue = useDeferredValue(searchValue);

  const tabList: CurrencyValutes[] = useMemo(
    () => [
      {
        name: { en: "ALL", ru: "ВСЕ" },
        currencies: Array.isArray(currencies)
          ? currencies.map((currency) => currency?.currencies).flat()
          : [],
        id: 0,
      },

      ...(Array.isArray(currencies) ? currencies : []),
    ],
    [currencies]
  );

  const filteredCurrencies = filterTabList({
    tabList: tabList,
    searchValue: searchDeferredValue,
  });

  useEffect(() => {
    setActiveTab(allKey);
  }, [allKey, i18n.language]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setActiveTab(allKey);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cx(
            "w-full h-[70px] transition-none bg-transparent border disabled:bg-opacity-0 flex items-center justify-start gap-3 rounded-[10px]",
            currencyInfo && "border-mainColor bg-mainColor"
          )}
          disabled={disabled}
        >
          {currencyInfo ? (
            <img
              src={currencyInfo.icon_url}
              alt={`иконка ${currencyInfo?.name}`}
              width={40}
              height={40}
              loading="lazy"
              className="rounded-full"
            />
          ) : (
            <div className="border rounded-full size-10" />
          )}
          {currencyInfo ? (
            <div className="grid grid-rows-2 items-center justify-start h-full text-darkGray text-[16px]">
              <p className="font-semibold text-start uppercase leading-0 truncate">
                {/* change */}
                {currencyInfo?.name?.ru}
              </p>
              <p className="leading-0 truncate text-start font-normal">
                {currencyInfo?.code_name}
              </p>
            </div>
          ) : (
            <div className="uppercase truncate text-white font-normal">
              {emptyLabel}
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-svh p-4 bg-new-dark-grey border-none">
        <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-left font-semibold text-base uppercase text-[#f6ff5f]">
              {label}
            </h2>
            <DrawerClose className=" rounded-full size-4 bg-mainColor">
              <X className="size-4" color="black" />
            </DrawerClose>
          </div>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-2   size-6" />
            <Input
              placeholder={t("ПОИСК ВАЛЮТЫ")}
              className="text-[16px] rounded-[10px] font-medium pl-12 bg-new-light-grey border-none placeholder:text-[#B9B9B9] placeholder:transition-opacity text-white uppercase focus:placeholder:opacity-0"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </DrawerHeader>
        {filteredCurrencies.length > 0 ? (
          <Tabs
            value={activeTab}
            defaultValue={allKey}
            onValueChange={setActiveTab}
            className=""
          >
            <TabsList
              data-vaul-no-drag
              className="bg-transparent flex flex-wrap justify-start gap-2 w-full h-full"
            >
              {filteredCurrencies?.map((tab) => (
                <TabsTrigger
                  key={tab?.id}
                  className={
                    "rounded-[7px] py-1 w-fit uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white  h-[26px] data-[state=active]:bg-mainColor shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                  }
                  value={tab?.name?.[i18n.language as Lang] || ""}
                >
                  <p className="truncate leading-0 font-bold">
                    {tab?.name?.[i18n.language as Lang]}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollArea className="h-[80svh]">
              {filteredCurrencies?.map((tab) => (
                <TabsContent
                  key={tab?.id}
                  className="flex flex-col"
                  value={tab?.name?.[i18n.language as Lang] || ""}
                >
                  {tab?.currencies?.map((currency) => (
                    <DrawerClose key={currency?.id}>
                      <CurrencyCard key={currency?.id} currency={currency} />
                    </DrawerClose>
                  ))}
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="grid justify-items-center gap-4 col-span-2 mb-[24px]">
            <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
            <Empty text={t("Ничего не найдено...")} />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
{
  /* {filteredCategories.categories?.map((filteredCategory) => (
              <TabsTrigger
                className={
                  "rounded-[7px] py-1 w-fit uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white  h-[26px] data-[state=active]:bg-mainColor shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                }
                value={filteredCategory}
              >
                <p className="truncate leading-0 font-bold">
                  {filteredCategory}
                </p>
              </TabsTrigger>
            ))}
          {filteredCategories.categories.length === 0 && (
            <div className="grid justify-items-center gap-4 col-span-2 mb-[24px]">
              <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
              <Empty text={t("Ничего не найдено...")} />
            </div>
          )} */
}

{
  /* <div className="">
            <div
              data-vaul-no-drag
              className="h-[calc(100svh_-_190px)] -mx-4  py-4 overflow-auto"
            >
              {filteredCategories?.categories.map((filteredCategory) => {
                if (filteredCategory !== activeTab) return null;
                return (
                  <TabsContent
                    className="grid mt-0 grid-rows-1 gap-2 px-4 pb-2 pt-1"
                    key={filteredCategory}
                    value={filteredCategory}
                  >
                    {currentCurrenciesWithCategories[filteredCategory]
                      ?.filter((currency) =>
                        [currency?.name, currency?.code_name].some((field) =>
                          field
                            ?.toLowerCase()
                            .includes(searchDeferredValue?.toLowerCase())
                        )
                      )
                      .map((currency) => (
                        <DrawerClose key={currency?.id} asChild>
                          <CurrencyCard
                            active={
                              currency.code_name === currencyInfo?.code_name
                            }
                            onClick={() => onClick?.(currency)}
                            currency={currency}
                          />
                        </DrawerClose>
                      ))}
                  </TabsContent>
                );
              })}
            </div>
          </div> */
}
