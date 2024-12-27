import { Currency, CurrencyCard, CurrencyValutes } from "@/entities/currency";
import { CloseDrawerIcon, SearchIcon } from "@/shared/assets";
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
} from "@/shared/ui";
import { cx } from "class-variance-authority";

import { Lang } from "@/shared/config";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { filterTabList } from "../lib/filter-currency";
import { useAppSelector } from "@/shared/hooks";
import { CurrencyTabsList } from "./currency-tabs-list";

type CurrecnySelectProps = {
  label: string;
  currencyInfo: Currency | null;
  disabled?: boolean;
  currencies?: CurrencyValutes[];
  emptyLabel?: string;
  onClick: (currency: Currency) => void;
};

export const CurrencySelect = (props: CurrecnySelectProps) => {
  const { currencies, disabled, emptyLabel, onClick, currencyInfo, label } =
    props;
  const activeDirection = useAppSelector(
    (state) => state.direction.activeDirection
  );
  const { i18n, t } = useTranslation();
  const allKey = t("Все");

  const [tabHeight, setTabHeight] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>(allKey);

  const [searchValue, setSearchValue] = useState<string>("");
  const searchDeferredValue = useDeferredValue(searchValue);

  const tabList: CurrencyValutes[] = useMemo(
    () => [
      {
        name: { en: "All", ru: "Все" },
        currencies: Array.isArray(currencies)
          ? currencies
              .map((category) => category?.currencies)
              .flat()
              .sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0))
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
  }, [allKey, i18n.language, activeDirection]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (activeTab != allKey) setActiveTab(allKey);
  };
  const currencyName =
    i18n.language === Lang.ru ? currencyInfo?.name.ru : currencyInfo?.name.en;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cx(
            "w-full h-[54px] transition-none bg-new-light-grey disabled:bg-opacity-70 flex items-center justify-start gap-3 rounded-[10px] p-[10px]",
            currencyInfo && "bg-mainColor"
          )}
          disabled={disabled}
        >
          {currencyInfo ? (
            <img
              src={currencyInfo.icon_url}
              alt={`иконка ${currencyName}`}
              width={32}
              height={32}
              loading="lazy"
              className="rounded-full "
            />
          ) : (
            <div className="border rounded-full size-8" />
          )}
          {currencyInfo ? (
            <div className="grid grid-rows-2 gap-1 items-center justify-start h-full text-darkGray text-[16px]">
              <p className="text-sm font-bold text-start uppercase leading-0 truncate">
                {currencyName}
              </p>
              <p className="leading-0 truncate text-start font-normal text-[#6F6F6F] text-sm">
                {currencyInfo?.code_name}
              </p>
            </div>
          ) : (
            <div className="text-sm truncate text-white font-normal">
              {emptyLabel}
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-svh p-0 flex gap-6 flex-col bg-new-dark-grey border-none">
        <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-6 px-5 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-left font-semibold text-base uppercase text-[#f6ff5f]">
              {label}
            </h2>
            <DrawerClose className="">
              <CloseDrawerIcon width={22} height={22} fill={"#f6ff5f"} />
            </DrawerClose>
          </div>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-6" />
            <Input
              placeholder={t("Поиск валюты")}
              className="text-[16px] rounded-[10px] font-normal pl-12 bg-new-light-grey border-none placeholder:text-[#B9B9B9] placeholder:transition-opacity text-[#b9b9b9] focus:placeholder:opacity-0"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </DrawerHeader>
        {filteredCurrencies.length > 0 ? (
          <div className="">
            <Tabs
              value={activeTab}
              defaultValue={allKey}
              onValueChange={setActiveTab}
              className="flex flex-col gap-5 p-0"
            >
              <CurrencyTabsList
                filteredCurrencies={filteredCurrencies}
                setTabHeight={setTabHeight}
              />
              <ScrollArea
                style={{
                  height: `calc(100dvh - ${tabHeight}px - 156px)`,
                }}
                className=""
              >
                {filteredCurrencies?.map((tab) => (
                  <TabsContent
                    key={tab?.id}
                    className="h-full"
                    value={tab?.name?.[i18n.language as Lang] || ""}
                  >
                    <div className="flex gap-4 mt-4 flex-col pb-4">
                      {tab?.currencies?.map((currency) => (
                        <DrawerClose key={currency?.id}>
                          <CurrencyCard
                            active={currency.id === currencyInfo?.id}
                            onClick={() => onClick(currency)}
                            key={currency?.id}
                            currency={currency}
                          />
                        </DrawerClose>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </div>
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
