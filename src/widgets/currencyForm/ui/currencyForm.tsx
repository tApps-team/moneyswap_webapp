import {
  Currency,
  currencyActions,
  giveCurrency,
  useAvailableValutesQuery,
} from "@/entities/currency";
import { CurrencySelect, CurrencySwitcher } from "@/features/currency";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const CurrencyForm = () => {
  const { i18n } = useTranslation();

  const dispatch = useAppDispatch();

  const giveCurrenciesValue = useAppSelector(
    (state) => state.currency.giveCurrency
  );
  const getCurrenciesValue = useAppSelector(
    (state) => state.currency.getCurrency
  );

  const { data: giveCurrencies } = useAvailableValutesQuery({ base: "all" });

  const { data: getCurrencies } = useAvailableValutesQuery(
    { base: giveCurrenciesValue?.code_name },
    {
      skip: !giveCurrenciesValue,
    }
  );

  const currentGiveCurrencies =
    i18n.language === "ru"
      ? giveCurrencies?.currencies.ru
      : giveCurrencies?.currencies.en;

  const currentGetCurrencies =
    i18n.language === "ru"
      ? getCurrencies?.currencies.ru
      : getCurrencies?.currencies.en;

  const currentGiveFilteredCateogry =
    i18n.language === "ru"
      ? giveCurrencies?.filteredCategories.ru
      : giveCurrencies?.filteredCategories.en;

  const currentGetFilteredCateogry =
    i18n.language === "ru"
      ? getCurrencies?.filteredCategories.ru
      : getCurrencies?.filteredCategories.en;

  const currenctGiveLabel = i18n.language === 'ru' ? Object.values(giveCurrencies?.currencies.ru || {}).map(currency => )

  const onGiveCurrencyClick = (currency: Currency) => {
    dispatch(currencyActions.setGiveCurrency(currency));
    dispatch(currencyActions.setGetCurrency(null));
  };
  const onGetCurrencyClick = (currency: Currency) => {
    dispatch(currencyActions.setGetCurrency(currency));
  };
  return (
    <Card className="grid grid-cols-1 grid-rows-3 ">
      <CurrencySelect
        label={{
          codeName: giveCurrenciesValue?.code_name || "",
          name: giveCurrenciesValue?.name || "",
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
          codeName: getCurrenciesValue?.code_name || "",
          name: getCurrenciesValue?.name || "",
        }}
        disabled={!getCurrencies}
        currencies={currentGetCurrencies}
        filteredCategories={currentGetFilteredCateogry}
        onClick={onGetCurrencyClick}
      />
    </Card>
  );
};
