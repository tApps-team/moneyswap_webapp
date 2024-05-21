import {
  Currency,
  CurrencyLang,
  currencyActions,
  useAvailableValutesQuery,
} from "@/entities/currency";
import { directions } from "@/entities/direction";
import { exchangerAPI } from "@/entities/exchanger";
import {
  CollapseButton,
  CurrencySelect,
  CurrencySwitcher,
} from "@/features/currency";

import { Lang } from "@/shared/config";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card, useToast } from "@/shared/ui";
import { cx } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CollapsedForm } from "./collapsedForm";

export const CurrencyForm = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const { activeDirection: direction } = useAppSelector(
    (state) => state.direction
  );
  const code_name = useAppSelector((state) => state.location.city?.code_name);

  const dispatch = useAppDispatch();

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
  const {
    data: giveCurrencies,
    error: giveCurrencyError,
    isError: isGiveCurrencyError,
  } = useAvailableValutesQuery({
    base: "all",
    city: direction === directions.cash ? code_name : undefined,
  });

  const {
    data: getCurrencies,
    error: getCurrencyError,
    isError: isGetCurrencyError,
    isLoading: isGetCurrencyLoading,
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
        title: t("Обмен этих пар пока что недоступен"),
      });
      if (direction === directions.cash) {
        dispatch(currencyActions.resetCashCurrency());
      } else {
        dispatch(currencyActions.resetNoCashCurrency());
      }
    }
  }, [direction, dispatch, getCurrencyError, t, toast]);

  // В зависимости от языка выбираем нужные нам объекты
  const currentGiveCurrencies =
    i18n.language === Lang.ru
      ? giveCurrencies?.currencies.ru
      : giveCurrencies?.currencies.en;

  const currentGetCurrencies =
    i18n.language === Lang.ru
      ? getCurrencies?.currencies.ru
      : getCurrencies?.currencies.en;

  // Функции при клике на карточку в разных селектах
  const onGiveCurrencyClick = (currency: Currency) => {
    const currencyRuName = giveCurrencies?.filteredCurrency?.ru.find(
      (curr) => curr.id === currency?.id
    )?.name;
    const currencyEnName = giveCurrencies?.filteredCurrency?.en.find(
      (curr) => curr.id === currency?.id
    )?.name;
    const currencyObject: CurrencyLang = {
      code_name: currency.code_name,
      icon_url: currency.icon_url,
      id: currency.id,
      name: {
        en: currencyEnName || "",
        ru: currencyRuName || "",
      },
    };
    dispatch(
      direction === directions.noncash
        ? currencyActions.setGiveCurrency(currencyObject)
        : currencyActions.setGiveCashCurrency(currencyObject)
    );
    dispatch(
      direction === directions.noncash
        ? currencyActions.setGetCurrency(null)
        : currencyActions.setGetCashCurrency(null)
    );
    dispatch(exchangerAPI.util.resetApiState());
  };
  const onGetCurrencyClick = (currency: Currency) => {
    const currencyRu = getCurrencies?.filteredCurrency?.ru.find(
      (curr) => curr.id === currency?.id
    );
    const currencyEn = getCurrencies?.filteredCurrency?.en.find(
      (curr) => curr.id === currency?.id
    );
    const currencyObject: CurrencyLang = {
      code_name: currency.code_name,
      icon_url: currency.icon_url,
      id: currency.id,
      name: {
        en: currencyEn?.name,
        ru: currencyRu?.name,
      },
    };
    dispatch(
      direction === directions.noncash
        ? currencyActions.setGetCurrency(currencyObject)
        : currencyActions.setGetCashCurrency(currencyObject)
    );
  };

  return (
    <div className="relative ">
      {currenctExchangersIsSuccessState ? (
        <CollapsedForm
          getCurrency={currentGetCurrency!}
          giveCurrency={currentGiveCurrency!}
        />
      ) : (
        <Card className="grid  grid-cols-1 grid-rows-[1fr,1fr,1fr,0.1fr]   bg-darkGray rounded-3xl gap-2 p-4 ">
          <div className="flex flex-col gap-2">
            <div
              className={cx(
                currentGiveCurrency && currentGetCurrency
                  ? "text-mainColor"
                  : "text-lightGray"
              )}
            >
              {t("ОТДАЮ")}
            </div>

            <CurrencySelect
              label={t("ОТДАЮ")}
              currencyInfo={
                currentGiveCurrency
                  ? {
                      code_name: currentGiveCurrency?.code_name,
                      icon_url: currentGiveCurrency?.icon_url,
                      name:
                        i18n.language === "ru"
                          ? currentGiveCurrency?.name.ru
                          : currentGiveCurrency?.name.en,
                    }
                  : undefined
              }
              disabled={direction === directions.cash && !code_name}
              emptyLabel={t("Выберите валюту")}
              currencies={currentGiveCurrencies}
              onClick={onGiveCurrencyClick}
            />
          </div>
          <CurrencySwitcher
            isGetCurrencyFetching={isGetCurrencyFetching}
            getError={isGetCurrencyError}
          />
          <div className="flex flex-col gap-2">
            <div
              className={cx(
                currentGiveCurrency && currentGetCurrency
                  ? "text-mainColor"
                  : "text-lightGray"
              )}
            >
              {t("ПОЛУЧАЮ")}
            </div>
            <CurrencySelect
              label={t("ПОЛУЧАЮ")}
              emptyLabel={t("Выберите валюту")}
              currencyInfo={
                currentGetCurrency
                  ? {
                      code_name: currentGetCurrency?.code_name,
                      icon_url: currentGetCurrency?.icon_url,
                      name:
                        i18n.language === "ru"
                          ? currentGetCurrency?.name.ru
                          : currentGetCurrency?.name.en,
                    }
                  : undefined
              }
              disabled={!currentGiveCurrency || !getCurrencies}
              currencies={currentGetCurrencies}
              onClick={onGetCurrencyClick}
            />
          </div>
        </Card>
      )}
      <CollapseButton
        onClick={() => setIsCollapse((prev) => !prev)}
        currenctExchangersIsSuccessState={currenctExchangersIsSuccessState}
        currentGiveCurrency={!!currentGiveCurrency}
        currentGetCurrencies={!!currentGetCurrencies}
      />
    </div>
  );
};
