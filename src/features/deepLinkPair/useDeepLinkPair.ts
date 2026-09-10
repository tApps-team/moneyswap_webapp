import { useEffect, useRef, useState } from "react";
import { Currency, CurrencyValutes, currencyActions, useAvailableValutesQuery } from "@/entities/currency";
import { setCity, setCountry, useGetCountriesQuery } from "@/entities/location";
import { directions } from "@/entities/direction";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { CheckQueries } from "@/features/checkQueries";

/**
 * Восстановление конкретной пары обмена из ссылки: `?give=USDTTRC20&get=SBERRUB`
 * (для наличных дополнительно `?city=MSK`). Параметры приезжают либо напрямую, либо
 * из `startapp` — его разворачивает applyStartParam() ещё до старта React.
 *
 * Пару нельзя просто положить в стор: в слайсе лежит объект Currency целиком, а в ссылке —
 * только code_name. Поэтому валюты ищем в тех же ответах /available_valutes, на которых
 * работает форма (RTK Query отдаёт их из кеша, лишних запросов нет), и делаем это по шагам:
 * город -> «отдаю» -> «получаю». Список «получаю» зависит от выбранной валюты «отдаю»,
 * так что раньше её выбора его просто не существует.
 */

const flatten = (groups?: CurrencyValutes[]): Currency[] =>
  groups?.flatMap((group) => group.currencies) ?? [];

const findByCode = (groups: CurrencyValutes[] | undefined, code: string) =>
  flatten(groups).find((currency) => currency.code_name.toLowerCase() === code.toLowerCase());

export const useDeepLinkPair = () => {
  const dispatch = useAppDispatch();

  // Снимок параметров делаем один раз: дальше пользователь волен менять пару руками,
  // и ссылка не должна возвращать его к исходной при каждом перезапросе списков.
  const [target] = useState(() => {
    const { direction, city, give, get } = CheckQueries();
    return { direction, city, give, get };
  });

  const isCash = target.direction === directions.cash;
  // Для наличных API отдаёт валюты только в разрезе города — без него пару не восстановить.
  const needsCity = isCash && Boolean(target.city);
  const canApply = Boolean(target.give) && (!isCash || needsCity);

  const currentCity = useAppSelector((state) => state.location.city?.code_name);
  const cityReady = !isCash || currentCity?.toLowerCase() === target.city?.toLowerCase();

  const cityApplied = useRef(false);
  const getApplied = useRef(false);
  // Не ref: от этого флага зависит skip третьего запроса, а ref не вызывает ре-рендер.
  const [giveApplied, setGiveApplied] = useState(false);

  const { data: countries } = useGetCountriesQuery("", { skip: !canApply || !needsCity });

  const { data: giveCurrencies } = useAvailableValutesQuery(
    { base: "all", city: isCash ? target.city ?? undefined : undefined },
    { skip: !canApply || !cityReady },
  );

  const { data: getCurrencies } = useAvailableValutesQuery(
    { base: target.give ?? undefined, city: isCash ? target.city ?? undefined : undefined },
    { skip: !canApply || !target.get || !giveApplied || !cityReady },
  );

  // Шаг 1 — город. Страну выставляем тоже: экран выбора локации показывает обе.
  useEffect(() => {
    if (!needsCity || cityApplied.current || !countries) return;

    const match = countries
      .flatMap((country) => (country.cities ?? []).map((city) => ({ country, city })))
      .find(({ city }) => city.code_name.toLowerCase() === target.city?.toLowerCase());

    cityApplied.current = true;
    if (!match) return;

    dispatch(setCountry(match.country));
    dispatch(setCity(match.city));
  }, [countries, needsCity, target.city, dispatch]);

  // Шаг 2 — «отдаю».
  useEffect(() => {
    if (!canApply || giveApplied || !giveCurrencies) return;

    const currency = findByCode(giveCurrencies, target.give as string);
    setGiveApplied(true);
    if (!currency) return;

    dispatch(
      isCash
        ? currencyActions.setGiveCashCurrency(currency)
        : currencyActions.setGiveCurrency(currency),
    );
  }, [giveCurrencies, canApply, giveApplied, isCash, target.give, dispatch]);

  // Шаг 3 — «получаю». Недоступную пару не подставляем: форма сама покажет пустое поле.
  useEffect(() => {
    if (!canApply || !target.get || getApplied.current || !getCurrencies) return;

    const currency = findByCode(getCurrencies, target.get);
    getApplied.current = true;
    if (!currency) return;

    dispatch(
      isCash
        ? currencyActions.setGetCashCurrency(currency)
        : currencyActions.setGetCurrency(currency),
    );
  }, [getCurrencies, canApply, isCash, target.get, dispatch]);
};
