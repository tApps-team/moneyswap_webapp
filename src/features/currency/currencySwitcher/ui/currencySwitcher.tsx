import { currencyActions } from "@/entities/currency";
import { directions } from "@/entities/direction";
import { LogoIcon } from "@/shared/assets";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button } from "@/shared/ui";

export const CurrencySwitcher = () => {
  const dispatch = useAppDispatch();
  const direction = useAppSelector((state) => state.direction.activeDirection);
  const giveCurrency = useAppSelector((state) =>
    direction === directions.cash
      ? state.currency.giveCashCurrency
      : state.currency.giveCurrency
  );
  const getCurrency = useAppSelector((state) =>
    direction === directions.cash
      ? state.currency.getCashCurrency
      : state.currency.getCurrency
  );
  const handleSwitchCurrency = () => {
    if (direction === directions.cash && giveCurrency && getCurrency) {
      dispatch(currencyActions.setGiveCashCurrency(getCurrency));
      dispatch(currencyActions.setGetCashCurrency(giveCurrency));
    }
    if (direction === directions.noncash && giveCurrency && getCurrency) {
      dispatch(currencyActions.setGiveCurrency(getCurrency));
      dispatch(currencyActions.setGetCurrency(giveCurrency));
    }
  };
  const isDisabled = !giveCurrency || !getCurrency;
  return (
    <Button
      disabled={isDisabled}
      onClick={handleSwitchCurrency}
      className="rounded-full h-20 w-20 bg-[#F6FF5F] "
      variant={"outline"}
    >
      <LogoIcon className="w-12 h-12" fill="black" />
    </Button>
  );
};
