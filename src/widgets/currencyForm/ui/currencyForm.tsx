import {
  Currency,
  CurrencyLang,
  currencyActions,
  useAvailableValutesQuery,
} from "@/entities/currency";
import { directions } from "@/entities/direction";
import { exchangerAPI } from "@/entities/exchanger";

import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import { Lang } from "@/shared/config";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export const CurrencyForm = () => {
  const { t, i18n } = useTranslation();

  const { activeDirection: direction } = useAppSelector(
    (state) => state.direction
  );
  const code_name = useAppSelector((state) => state.location.city?.code_name);

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
    direction === directions.noncash
      ? giveCurrencyValue
      : giveCashCurrencyValue;
  const currentGetCurrency =
    direction === directions.noncash ? getCurrencyValue : getCashCurrencyValue;
  // Запросы на получения валюты
  const { data: giveCurrencies } = useAvailableValutesQuery({
    base: "all",
    city: direction === directions.cash ? code_name : undefined,
  });

  const { data: getCurrencies } = useAvailableValutesQuery(
    {
      base:
        direction === directions.cash
          ? giveCashCurrencyValue?.code_name
          : giveCurrencyValue?.code_name,
      city: direction === directions.cash ? code_name : undefined,
    },
    {
      skip:
        direction === directions.noncash
          ? !giveCurrencyValue
          : !giveCashCurrencyValue,
    }
  );
  // В зависимости от языка выбираем нужные нам объекты
  const currentGiveCurrencies =
    i18n.language === Lang.ru
      ? giveCurrencies?.filteredCurrency.ru
      : giveCurrencies?.filteredCurrency.en;

  const currentGetCurrencies =
    i18n.language === Lang.ru
      ? getCurrencies?.filteredCurrency.ru
      : getCurrencies?.filteredCurrency.en;

  const currentGiveFilteredCateogry =
    i18n.language === Lang.ru
      ? giveCurrencies?.filteredCategories.ru
      : giveCurrencies?.filteredCategories.en;

  const currentGetFilteredCateogry =
    i18n.language === Lang.ru
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
        en: currencyEn?.name || "",
        ru: currencyRu?.name || "",
      },
    };
    dispatch(
      direction === directions.noncash
        ? currencyActions.setGetCurrency(currencyObject)
        : currencyActions.setGetCashCurrency(currencyObject)
    );
  };

  return (
    <Card className="grid grid-cols-1 grid-rows-4 ">
      <CurrencySelect
        label={{
          codeName: currentGiveCurrency?.code_name,
          name:
            i18n.language === Lang.ru
              ? currentGiveCurrency?.name.ru
              : currentGiveCurrency?.name.en,
        }}
        disabled={direction === directions.cash && !code_name}
        emptyLabel={t("Выберите валюту")}
        filteredCategories={currentGiveFilteredCateogry}
        currencies={currentGiveCurrencies}
        onClick={onGiveCurrencyClick}
      />
      <CurrencySwitcher />
      <CurrencySelect
        emptyLabel={t("Выберите валюту")}
        label={{
          codeName: currentGetCurrency?.code_name,
          name:
            i18n.language === Lang.ru
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
