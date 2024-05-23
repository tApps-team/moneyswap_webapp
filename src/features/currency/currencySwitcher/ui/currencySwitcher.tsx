import { currencyActions } from "@/entities/currency";
import { directions } from "@/entities/direction";
import { LogoIcon } from "@/shared/assets";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button } from "@/shared/ui";
import { cx } from "class-variance-authority";
import { useEffect } from "react";
type CurrencySwitcherProps = {
  getError?: boolean;
  isGetCurrencyFetching?: boolean;
  hide?: boolean;
};
export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { getError, isGetCurrencyFetching, hide } = props;

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

  const canSwitch = giveCurrency && getCurrency;

  const handleSwitchCurrency = () => {
    if (direction === directions.cash && canSwitch) {
      dispatch(currencyActions.setGiveCashCurrency(getCurrency));
      dispatch(currencyActions.setGetCashCurrency(giveCurrency));
    }
    if (direction === directions.noncash && canSwitch) {
      dispatch(currencyActions.setGiveCurrency(getCurrency));
      dispatch(currencyActions.setGetCurrency(giveCurrency));
    }
  };
  const isDisabled = !giveCurrency || !getCurrency;
  return (
    <div
      className={cx(
        "relative w-full flex items-center justify-center",
        hide && "hidden"
      )}
    >
      <div
        className={cx(
          "absolute h-1 w-full ",
          isDisabled ? "bg-lightGray" : "bg-mainColor"
        )}
      ></div>
      <Button
        disabled={isDisabled}
        onClick={handleSwitchCurrency}
        className="rounded-full  h-16 w-16 absolute border-none disabled:opacity-100   disabled:bg-lightGray bg-[#F6FF5F]"
      >
        <LogoIcon className="w-12 h-12  " fill="black" />
      </Button>
    </div>
  );
};
