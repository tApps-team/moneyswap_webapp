import { Currency, CurrencyCard, CurrencyCategory } from "@/entities/currency";
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
import { Search } from "lucide-react";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type CurrecnySelectProps = {
  label: string;
  currencyInfo?: Omit<Currency, "id">;
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
          className="w-full h-[70px] text-black disabled:bg-lightGray bg-mainColor flex items-center justify-start gap-6 rounded-full"
          disabled={disabled}
        >
          {currencyInfo?.icon_url ? (
            <img
              src={currencyInfo.icon_url}
              alt={`иконка ${currencyInfo?.name}`}
              width={40}
              height={40}
            />
          ) : (
            <div className="border rounded-full size-10" />
          )}
          {currencyInfo?.name ? (
            <div className="flex flex-col items-start">
              <div>{currencyInfo.name}</div>
              <div>{currencyInfo.code_name}</div>
            </div>
          ) : (
            <div className="uppercase truncate">{emptyLabel}</div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-svh p-4 grid grid-rows-[1fr,1fr,2fr] bg-slate-400">
        <DrawerHeader className="text-start">{label}</DrawerHeader>
        <div className="relative">
          <Search className="absolute left-2 translate-y-2" />
          <Input
            className="rounded-2xl pl-8"
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
                className="rounded-2xl uppercase border-2 h-11 data-[state=active]:bg-mainColor"
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
