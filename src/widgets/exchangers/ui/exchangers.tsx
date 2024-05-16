import styles from "./exchangers.module.scss";
import { useGetExchangersQuery } from "@/entities/exchanger";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Preloader, SystemError } from "@/shared/ui";
import { ExchangerList } from "@/features/exchanger";
import { FC } from "react";
import { directions } from "@/entities/direction";
import { currencyActions } from "@/entities/currency";

interface ExchangersProps {}

export const Exchangers: FC<ExchangersProps> = () => {
  const { city } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const { activeDirection } = useAppSelector((state) => state.direction);
  // const {} = useAppSelector((state)=>state.)
  const giveCurrency = useAppSelector((state) =>
    activeDirection === directions.cash
      ? state.currency.giveCashCurrency
      : state.currency.giveCurrency
  );
  const getCurrency = useAppSelector((state) =>
    activeDirection === directions.cash
      ? state.currency.getCashCurrency
      : state.currency.getCurrency
  );
  const exchangersReq = {
    city: city?.code_name,
    valute_from: giveCurrency?.code_name || "",
    // добавить сюда directions.cash === activeDirection ? currencyCash : currencyNoncash
    valute_to: getCurrency?.code_name || "",
  };
  const {
    data: exchangersCash,
    isFetching: isCashFetching,
    error: cashError,
  } = useGetExchangersQuery(exchangersReq, {
    skip: activeDirection !== directions.cash || !giveCurrency || !getCurrency,
    // добавить сюда currencyCash
  });
  if (cashError) {
    dispatch(currencyActions.setGiveCashCurrency(null));
    dispatch(currencyActions.setGetCashCurrency(null));
  }
  const {
    data: exchangersNoncash,
    isFetching: isNoncashFetching,
    error: noncashError,
  } = useGetExchangersQuery(exchangersReq, {
    skip: activeDirection !== directions.noncash,
    // добавить сюда currencyNoncash
  });

  const exchangers = directions.cash ? exchangersCash : exchangersNoncash;

  return (
    <section className={styles.exchangers}>
      {isCashFetching || isNoncashFetching ? (
        <div className={styles.preloaderWrapper}>
          <Preloader
            className={styles.preloader}
            progress={0}
            strokeWidth={20}
            step={30}
          />
        </div>
      ) : cashError || noncashError ? (
        <SystemError direction={true} />
      ) : (
        exchangers && (
          <ExchangerList
            exchangers={exchangers}
            currencyGive={{ name: "sdfsdf" }}
            // добавить сюда directions.cash === activeDirection ? currencyCash : currencyNoncash
            currencyGet={{ name: "sdfsdf" }}
            city={city && city}
          />
        )
      )}
    </section>
  );
};
