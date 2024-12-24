import {
  Currency,
  currencyActions,
  useAvailableValutesQuery,
} from "@/entities/currency";
import { directions } from "@/entities/direction";
import {
  CollapseButton,
  CurrencySelectCash,
  CurrencySwitcher,
} from "@/features/currency";

import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card, useToast } from "@/shared/ui";
import { cx } from "class-variance-authority";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CollapsedForm } from "./collapsedForm";

export const CurrencyFormCash = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { activeDirection: direction } = useAppSelector(
    (state) => state.direction
  );
  const code_name = useAppSelector((state) => state.location.city?.code_name);

  const cashExchangersIsSuccess = useAppSelector(
    (state) => state.currencyForm.cashExchangersIsSuccess
  );
  const noCashExchangersIsSuccess = useAppSelector(
    (state) => state.currencyForm.noCashExchangersIsSuccess
  );
  const currenctExchangersIsSuccessState =
    direction === directions.cash
      ? cashExchangersIsSuccess
      : noCashExchangersIsSuccess;

  const [isCollapse, setIsCollapse] = useState(
    currenctExchangersIsSuccessState
  );
  useEffect(() => {
    setIsCollapse(currenctExchangersIsSuccessState);
  }, [currenctExchangersIsSuccessState]);

  // Селекторы для получения выбранной валюты
  const giveCurrencyValue = useAppSelector(
    (state) => state.currency.giveCurrency
  );
  const giveCashCurrencyValue = useAppSelector(
    (state) => state.currency.giveCashCurrency
  );

  const getCurrencyValue = useAppSelector(
    (state) => state.currency.getCurrency
  );
  const getCashCurrencyValue = useAppSelector(
    (state) => state.currency.getCashCurrency
  );

  const currentGiveCurrency =
    direction === directions.noncash
      ? giveCurrencyValue
      : giveCashCurrencyValue;

  const currentGetCurrency =
    direction === directions.noncash ? getCurrencyValue : getCashCurrencyValue;
  // Запросы на получения валюты
  const { data: giveCurrencies, error: giveCurrencyError } =
    useAvailableValutesQuery({
      base: "all",
      city: direction === directions.cash ? code_name : undefined,
    });

  const {
    data: getCurrencies,
    error: getCurrencyError,
    isError: isGetCurrencyError,
    isFetching: isGetCurrencyFetching,
  } = useAvailableValutesQuery(
    {
      base:
        direction === directions.cash
          ? giveCashCurrencyValue?.code_name
          : giveCurrencyValue?.code_name,
      city: direction === directions.cash ? code_name : undefined,
    },
    {
      skip: !currentGiveCurrency,
    }
  );
  useEffect(() => {
    if (getCurrencyError) {
      toast({
        title: t("Выбранное направление недоступно"),
      });
      if (direction === directions.cash) {
        dispatch(currencyActions.resetCashCurrency());
      } else {
        dispatch(currencyActions.resetNoCashCurrency());
      }
    }
  }, [direction, dispatch, getCurrencyError, t, toast]);

  const onClickGiveCurrency = useCallback(
    (currency: Currency) => {
      dispatch(
        direction === directions.noncash
          ? currencyActions.setGiveCurrency(currency)
          : currencyActions.setGiveCashCurrency(currency)
      );
    },
    [direction, dispatch]
  );
  const onClickGetCurrency = useCallback(
    (currency: Currency) => {
      dispatch(
        direction === directions.noncash
          ? currencyActions.setGetCurrency(currency)
          : currencyActions.setGetCashCurrency(currency)
      );
    },
    [direction, dispatch]
  );

  return (
    <div className="relative mb-4">
      {isCollapse ? (
        <CollapsedForm
          onClick={() => setIsCollapse((prev) => !prev)}
          getCurrency={currentGetCurrency!}
          giveCurrency={currentGiveCurrency!}
        />
      ) : (
        <Card className="rounded-[10px] grid border-0 grid-cols-1 grid-rows-[1fr,0.8fr,1fr,0.1fr] bg-new-dark-grey gap-2 p-5">
          <div className="flex flex-col gap-4">
            <p
              className={cx(
                "font_unbounded leading-0 font-semibold text-mainColor"
              )}
            >
              {t("ОТДАЮ")}
            </p>

            <CurrencySelectCash
              label={t("ОТДАЮ")}
              currencyInfo={currentGiveCurrency}
              disabled={
                (direction === directions.cash && !code_name) ||
                (giveCurrencyError && true)
              }
              emptyLabel={t("Выберите валюту")}
              currencies={giveCurrencies}
              onClick={onClickGiveCurrency}
            />
          </div>
          <CurrencySwitcher
            isGetCurrencyFetching={isGetCurrencyFetching}
            getError={isGetCurrencyError}
          />
          <div className="flex flex-col gap-4 -mt-2.5">
            <p
              className={cx(
                "font_unbounded leading-0 font-semibold text-mainColor"
              )}
            >
              {t("ПОЛУЧАЮ")}
            </p>
            <CurrencySelectCash
              label={t("ПОЛУЧАЮ")}
              emptyLabel={t("Выберите валюту")}
              currencyInfo={currentGetCurrency}
              disabled={
                (!currentGetCurrency && !currentGiveCurrency) ||
                (!currentGetCurrency && !getCurrencies)
              }
              currencies={getCurrencies}
              onClick={onClickGetCurrency}
            />
          </div>
        </Card>
      )}
      <CollapseButton
        isCollapse={isCollapse}
        onClick={() => setIsCollapse((prev) => !prev)}
        currenctExchangersIsSuccessState={currenctExchangersIsSuccessState}
        currentGiveCurrency={!!currentGiveCurrency}
        currentGetCurrencies={!!currentGetCurrency}
      />
    </div>
  );
};
