import {
  Currency,
  CurrencyCard,
  getCashCurrency,
  getCurrency,
  giveCashCurrency,
  giveCurrency,
} from "@/entities/currency";
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

import { useState } from "react";
import { useSelector } from "react-redux";

type CurrecnySelectProps = {
  disabled?: boolean;
  currencies?: Currency[];
  filteredCategories?: string[];
  iconUrl?: string;
  label?: {
    name: string;
    codeName: string;
  };
  emptyLabel?: string;
  onClick?: (currency: Currency) => void;
};
export const CurrencySelect = (props: CurrecnySelectProps) => {
  const {
    currencies,
    disabled,
    emptyLabel,
    iconUrl,
    label,
    filteredCategories,
    onClick,
  } = props;
  console.log(label);
  const [searchValue, setSearchValue] = useState<string>("");
  // const getCurrencyValute = useSelector(getCurrency);
  // const giveCurrencyValute = useSelector(giveCurrency);
  // const getCashCurrencyValute = useSelector(getCashCurrency);
  // const giveCashCurrencyValute = useSelector(giveCashCurrency);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="w-full h-[70px] flex items-center justify-start gap-6 rounded-full"
          disabled={disabled}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`иконка ${label?.name}`}
              width={40}
              height={40}
            />
          ) : (
            <div className="border rounded-full size-8" />
          )}
          {label ? (
            <div className="flex flex-col items-start">
              <div>{label.name}</div>
              <div>{label.codeName}</div>
            </div>
          ) : (
            <div>{emptyLabel}</div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[100svh]  gap-6 bg-slate-400">
        <DrawerHeader>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Tabs defaultValue="all" className="w-full ">
            <TabsList
              data-vaul-no-drag
              className="bg-transparent   grid grid-cols-2 gap-2"
            >
              <TabsTrigger
                className="rounded-xl uppercase border-2"
                value="all"
              >
                ВСЕ
              </TabsTrigger>
              {filteredCategories?.map((filteredCategory) => (
                <TabsTrigger
                  className="rounded-xl uppercase border-2"
                  key={filteredCategory}
                  value={filteredCategory}
                >
                  <div className="truncate">{filteredCategory}</div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </DrawerHeader>
        <ScrollArea data-vaul-no-drag className="h-full p-4 w-full ">
          <div className="grid grid-rows-1 items gap-2">
            {currencies?.map((currency) => (
              <DrawerClose key={currency.id} asChild>
                <CurrencyCard
                  onClick={() => onClick?.(currency)}
                  currency={currency}
                />
              </DrawerClose>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
