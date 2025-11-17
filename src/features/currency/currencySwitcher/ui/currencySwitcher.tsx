import { currencyActions } from "@/entities/currency";
import { directions, useIncreaseDirectionCountMutation } from "@/entities/direction";
import { RefreshIcon } from "@/shared/assets";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { handleVibration } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { cx } from "class-variance-authority";

type CurrencySwitcherProps = {
  getError?: boolean;
  isGetCurrencyFetching?: boolean;
  hide?: boolean;
};

export const CurrencySwitcher = (props: CurrencySwitcherProps) => {
  const { hide } = props;

  const dispatch = useAppDispatch();
  const direction = useAppSelector((state) => state.direction.activeDirection);
  const city = useAppSelector((state) => state.location.city);
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

  // increase direction count
  const [increaseDirectionCount] = useIncreaseDirectionCountMutation();

  const handleSwitchCurrency = () => {
    if (direction === directions.cash && canSwitch) {
      dispatch(currencyActions.setGiveCashCurrency(getCurrency));
      dispatch(currencyActions.setGetCashCurrency(giveCurrency));
    }
    if (direction === directions.noncash && canSwitch) {
      dispatch(currencyActions.setGiveCurrency(getCurrency));
      dispatch(currencyActions.setGetCurrency(giveCurrency));
    }
    if (giveCurrency && getCurrency) {
      increaseDirectionCount({
        valute_from: getCurrency?.code_name,
        valute_to: giveCurrency?.code_name,
        city_code_name: direction === directions.cash ? city?.code_name ?? null : null,
      });
    }
    handleVibration();
  };
  const isDisabled = !giveCurrency || !getCurrency;
  return (
    <div
      className={cx(
        "relative w-full flex z-0 items-center justify-center",
        hide && "hidden"
      )}
    >
      <div
        className={cx("absolute h-[2px] -z-10 w-full bg-new-light-grey ")}
      ></div>
      <Button
        disabled={isDisabled}
        onClick={handleSwitchCurrency}
        className={`rounded-full flex items-center justify-center size-12 border-none disabled:opacity-100 bg-new-light-grey p-2.5 ${
          isDisabled ? "[&>svg]:fill-new-dark-grey" : "[&>svg]:fill-mainColor"
        }`}
      >
        <RefreshIcon />
      </Button>
    </div>
  );
};
