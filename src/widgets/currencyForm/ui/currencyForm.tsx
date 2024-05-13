import {
  Currency,
  CurrencyLang,
  currencyActions,
  giveCurrency,
  useAvailableValutesQuery,
} from "@/entities/currency";

import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button, Card } from "@/shared/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
enum Directions {
  cash = "cash",
  noncash = "noncash",
}
export const CurrencyForm = () => {
  const { i18n } = useTranslation();

  const [direction, setDirection] = useState("cash");

  const dispatch = useAppDispatch();
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
    direction === Directions.noncash
      ? giveCurrencyValue
      : giveCashCurrencyValue;
  const currentGetCurrency =
    direction === Directions.noncash ? getCurrencyValue : getCashCurrencyValue;
  // Запросы на получения валюты
  const { data: giveCurrencies } = useAvailableValutesQuery({
    base: "all",
    city: direction === Directions.cash ? "msk" : undefined,
  });

  const { data: getCurrencies } = useAvailableValutesQuery(
    {
      base:
        direction === Directions.cash
          ? giveCashCurrencyValue?.code_name
          : giveCurrencyValue?.code_name,
      city: direction === Directions.cash ? "msk" : undefined,
    },
    {
      skip:
        direction === Directions.noncash
          ? !giveCurrencyValue
          : !giveCashCurrencyValue,
    }
  );
  // В зависимости от языка выбираем нужные нам объекты
  const currentGiveCurrencies =
    i18n.language === "ru"
      ? giveCurrencies?.filteredCurrency.ru
      : giveCurrencies?.filteredCurrency.en;

  const currentGetCurrencies =
    i18n.language === "ru"
      ? getCurrencies?.filteredCurrency.ru
      : getCurrencies?.filteredCurrency.en;

  const currentGiveFilteredCateogry =
    i18n.language === "ru"
      ? giveCurrencies?.filteredCategories.ru
      : giveCurrencies?.filteredCategories.en;

  const currentGetFilteredCateogry =
    i18n.language === "ru"
      ? getCurrencies?.filteredCategories.ru
      : getCurrencies?.filteredCategories.en;

  // Функции при клике на карточку в разных селектах
  const onGiveCurrencyClick = (currency: Currency) => {
    const currencyRu = giveCurrencies?.filteredCurrency?.ru.find(
      (curr) => curr.id === currency?.id
    );
    const currencyEn = giveCurrencies?.filteredCurrency?.en.find(
      (curr) => curr.id === currency?.id
    );
    const currencyObject: CurrencyLang = {
      code_name: currency.code_name,
      icon_url: currency.icon_url,
      id: currency.id,
      name: {
        en: currencyEn?.name || "",
        ru: currencyRu?.name || "",
      },
    };
    dispatch(
      direction === Directions.noncash
        ? currencyActions.setGiveCurrency(currencyObject)
        : currencyActions.setGiveCashCurrency(currencyObject)
    );
    dispatch(
      direction === Directions.noncash
        ? currencyActions.setGetCurrency(null)
        : currencyActions.setGetCashCurrency(null)
    );
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
        en: currencyEn?.name || "",
        ru: currencyRu?.name || "",
      },
    };
    dispatch(
      direction === Directions.noncash
        ? currencyActions.setGetCurrency(currencyObject)
        : currencyActions.setGetCashCurrency(currencyObject)
    );
  };
  const handleClickSwitchDirection = () => {
    setDirection((prev) =>
      prev === Directions.cash ? Directions.noncash : Directions.cash
    );
  };

  return (
    <Card className="grid grid-cols-1 grid-rows-4 ">
      <span>{direction}</span>
      <Button onClick={() => handleClickSwitchDirection()}>
        SwitchDirection
      </Button>
      <CurrencySelect
        label={{
          codeName: currentGiveCurrency?.code_name,
          name:
            i18n.language === "ru"
              ? currentGiveCurrency?.name.ru
              : currentGiveCurrency?.name.en,
        }}
        emptyLabel="Выберите валюту"
        filteredCategories={currentGiveFilteredCateogry}
        currencies={currentGiveCurrencies}
        onClick={onGiveCurrencyClick}
      />
      <CurrencySwitcher />
      <CurrencySelect
        emptyLabel="Выберите валюту"
        label={{
          codeName: currentGetCurrency?.code_name,
          name:
            i18n.language === "ru"
              ? currentGetCurrency?.name.ru
              : currentGetCurrency?.name.en,
        }}
        disabled={!getCurrencies}
        currencies={currentGetCurrencies}
        filteredCategories={currentGetFilteredCateogry}
        onClick={onGetCurrencyClick}
      />
    </Card>
  );
};
