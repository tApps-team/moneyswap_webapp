import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import {
  Currency,
  CurrencyLang,
  currencyActions,
  useAvailableValutesQuery,
} from "@/entities/currency";
import { directions } from "@/entities/direction";

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
  const { data: giveCurrencies, error: giveCurrencyError } =
    useAvailableValutesQuery({
      base: "all",
      city: direction === directions.cash ? code_name : undefined,
    });
  if (giveCurrencyError) {
    if (direction === directions.cash) {
      dispatch(currencyActions.setGetCashCurrency(null));
    } else {
      dispatch(currencyActions.setGetCurrency(null));
    }
  }
  const { data: getCurrencies, error: getCurrencyError } =
    useAvailableValutesQuery(
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
    <Card className="grid grid-cols-1 grid-rows-3 gap-2 p-4 ">
      <div className="flex flex-col gap-2">
        <div>{t("ОТДАЮ")}</div>
        <CurrencySelect
          label={t("ОТДАЮ")}
          currencyInfo={{
            code_name: currentGiveCurrency?.code_name || "",
            icon_url: currentGiveCurrency?.icon_url || "",
            name:
              (i18n.language === "ru"
                ? currentGiveCurrency?.name.ru
                : currentGiveCurrency?.name.en) || "",
          }}
          disabled={direction === directions.cash && !code_name}
          emptyLabel={t("Выберите валюту")}
          currencies={currentGiveCurrencies}
          onClick={onGiveCurrencyClick}
        />
      </div>
      <CurrencySwitcher />
      <div className="flex flex-col gap-2">
        <div>{t("ПОЛУЧАЮ")}</div>
        <CurrencySelect
          label={t("ПОЛУЧАЮ")}
          emptyLabel={t("Выберите валюту")}
          currencyInfo={{
            code_name: currentGetCurrency?.code_name || "",
            icon_url: currentGetCurrency?.icon_url || "",
            name:
              (i18n.language === "ru"
                ? currentGetCurrency?.name.ru
                : currentGetCurrency?.name.en) || "",
          }}
          disabled={!currentGiveCurrency}
          currencies={currentGetCurrencies}
          onClick={onGetCurrencyClick}
        />
      </div>
    </Card>
  );
};
