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
} from "@/shared/ui";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState } from "react";
import { useSelector } from "react-redux";

type CurrecnySelectProps = {
  disabled?: boolean;
  currencies?: Currency[];
  iconUrl?: string;
  label?: {
    name: string;
    codeName: string;
  };
  emptyLable?: string;
};
export const CurrencySelect = (props: CurrecnySelectProps) => {
  const { currencies, disabled, emptyLable, iconUrl, label } = props;

  const [searchValue, setSearchValue] = useState<string>("");
  // const getCurrencyValute = useSelector(getCurrency);
  // const giveCurrencyValute = useSelector(giveCurrency);
  // const getCashCurrencyValute = useSelector(getCashCurrency);
  // const giveCashCurrencyValute = useSelector(giveCashCurrency);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={`иконка ${label?.name}`}
              width={40}
              height={40}
            />
          ) : (
            <div className="border rounded-full w-40 h-40" />
          )}
          {
            label ? 
          }
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </DrawerHeader>
        <ScrollArea>
          <div className="grid grid-rows-1 items gap-2">
            {currencies?.map((currency) => (
              <DrawerClose key={currency.id}>
                <CurrencyCard currency={currency} />
              </DrawerClose>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
