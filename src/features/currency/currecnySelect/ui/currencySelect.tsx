import { Currency, CurrencyCard, CurrencyCategory } from "@/entities/currency";
import { SearchIcon } from "@/shared/assets";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Input,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cx } from "class-variance-authority";
import { Search } from "lucide-react";

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
  console.log(currencyInfo);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cx(
            "w-full h-[70px]  disabled:bg-lightGray bg-transparent border disabled:bg-opacity-0  flex items-center justify-start gap-6 rounded-full",
            currencyInfo && "bg-mainColor border-mainColor"
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
            <div className="flex flex-col items-start text-black">
              <div className="font-bold text-base uppercase">
                {currencyInfo.name}
              </div>
              <div className="text-base">{currencyInfo.code_name}</div>
            </div>
          ) : (
            <div className="uppercase truncate text-white font-normal">
              {emptyLabel}
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-svh p-4 bg-transparent  grid grid-rows-[1fr,1fr,2fr] border-none">
        <DrawerHeader className="text-start text-mainColor text-lg p-0">
          {label}
        </DrawerHeader>
        <div className="relative">
          <SearchIcon className="absolute left-2 translate-y-[6px] size-[30px]" />
          <Input
            placeholder={t("ПОИСК ВАЛЮТЫ")}
            className="rounded-2xl pl-12 bg-lightGray border-none placeholder:text-darkGray"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue={allKey}
          className="min-h-[80svh] flex flex-col gap-[70px] "
        >
          <TabsList
            data-vaul-no-drag
            className="bg-transparent grid grid-cols-2 gap-2"
          >
            {filteredCategories.categories?.map((filteredCategory) => (
              <TabsTrigger
                className={
                  "rounded-2xl uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white  border-2 h-11 data-[state=active]:bg-mainColor"
                }
                key={filteredCategory}
                value={filteredCategory}
              >
                <div className="truncate">{filteredCategory}</div>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea data-vaul-no-drag className="">
            {filteredCategories.categories.map((filteredCategory) => (
              <TabsContent
                className="grid mt-0 grid-rows-1 gap-2"
                key={filteredCategory}
                value={filteredCategory}
              >
                {currentCurrniesWithCategories[filteredCategory]
                  ?.filter((currency) =>
                    currency.name
                      .toLowerCase()
                      .includes(searchDeferredValue.toLowerCase())
                  )
                  .map((currency) => (
                    <DrawerClose key={currency.id} asChild>
                      <CurrencyCard
                        active={currency.code_name === currencyInfo?.code_name}
                        onClick={() => onClick?.(currency)}
                        currency={currency}
                      />
                    </DrawerClose>
                  ))}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};
