import { Currency, CurrencyCard, CurrencyCategory } from "@/entities/currency";
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
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cx } from "class-variance-authority";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type CurrecnySelectProps = {
  label: string;
  currencyInfo?: Partial<Omit<Currency, "id">>;
  disabled?: boolean;
  currencies?: CurrencyCategory;
  emptyLabel?: string;
  onClick?: (currency: Currency) => void;
};
export const CurrencySelect = (props: CurrecnySelectProps) => {
  const { currencies, disabled, emptyLabel, onClick, currencyInfo, label } =
    props;

  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>("");
  const searchDeferredValue = useDeferredValue(searchValue);
  const allKey = t("ВСЕ");

  const currentCurrniesWithCategories: CurrencyCategory = useMemo(
    () => ({
      [allKey]: Object.values(currencies || {}).flat() || [],
      ...currencies,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currencies]
  );

  const filteredCategories = useMemo(() => {
    const filteredKeys = Object.keys(currentCurrniesWithCategories).filter(
      (filterKey) =>
        currentCurrniesWithCategories[filterKey].some((currency) =>
          currency.name
            .toLowerCase()
            .includes(searchDeferredValue.toLowerCase())
        )
    );

    return {
      categories: filteredKeys,
    };
  }, [currentCurrniesWithCategories, searchDeferredValue]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cx(
            "w-full h-[70px] transition-none bg-transparent border disabled:bg-opacity-0 flex items-center justify-start gap-3 rounded-full",
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
            />
          ) : (
            <div className="border rounded-full size-10" />
          )}
          {currencyInfo ? (
            <div className="flex truncate  flex-col items-start text-black">
              <div className="font-bold  text-base uppercase">
                {currencyInfo?.name}
              </div>
              <div className="text-base">{currencyInfo?.code_name}</div>
            </div>
          ) : (
            <div className="uppercase truncate text-white font-normal">
              {emptyLabel}
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[100svh] p-4 bg-transparent border-none">
        <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-4 pt-4">
          {/* <div className="flex justify-center items-center">
            <LogoIcon width="80px" height="80px" />
          </div> */}
          <div className="relative">
            <h2 className="text-left text-base uppercase text-[#f6ff5f]">
              {label}
            </h2>
            <DrawerClose className="absolute right-0 top-0">
              <CloseDrawerIcon width={26} height={26} />
            </DrawerClose>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-2 translate-y-[6px] size-[30px]" />
            <Input
              placeholder={t("ПОИСК ВАЛЮТЫ")}
              className="rounded-2xl pl-12 bg-lightGray border-none placeholder:text-darkGray placeholder:transition-opacity text-darkGray uppercase focus:placeholder:opacity-0"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </DrawerHeader>
        <Tabs defaultValue={allKey} className="grid grid-flow-row">
          <TabsList
            data-vaul-no-drag
            className="bg-transparent grid grid-cols-2 gap-2 h-full py-4 px-0"
          >
            {filteredCategories.categories?.map((filteredCategory) => (
              <TabsTrigger
                className={
                  "rounded-2xl border-lightGray uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white border-2 h-11 data-[state=active]:bg-mainColor"
                }
                key={filteredCategory}
                value={filteredCategory}
              >
                <div className="truncate">{filteredCategory}</div>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="">
            <ScrollArea
              data-vaul-no-drag
              className="h-[calc(100svh_-_256px)] px-4 -mx-4"
            >
              {filteredCategories?.categories.length ? (
                filteredCategories?.categories.map((filteredCategory) => (
                  <TabsContent
                    className="grid mt-0 grid-rows-1 gap-2"
                    key={filteredCategory}
                    value={filteredCategory}
                  >
                    {currentCurrniesWithCategories[filteredCategory]
                      ?.filter((currency) =>
                        currency.name
                          .toLowerCase()
                          .includes(searchDeferredValue?.toLowerCase())
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
                ))
              ) : (
                <Empty text={t("Ничего не найдено...")} />
              )}
            </ScrollArea>
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};
