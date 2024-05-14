import styles from "./exchangers.module.scss";
import { useGetExchangersQuery } from "@/entities/exchanger";
import { useAppSelector } from "@/shared/hooks";
import { Preloader, SystemError } from "@/shared/ui";
import { ExchangerList } from "@/features/exchanger";
import { FC } from "react";
import { directions } from "@/entities/direction";

interface ExchangersProps {}

export const Exchangers: FC<ExchangersProps> = () => {
  const { city } = useAppSelector((state) => state.location);
  const { activeDirection } = useAppSelector((state) => state.direction);
  // const {} = useAppSelector((state)=>state.)

  const exchangersReq = {
    city: city?.code_name,
    valute_from: "dsfsdf",
    // добавить сюда directions.cash === activeDirection ? currencyCash : currencyNoncash
    valute_to: "sdfsdf",
  };
  const {
    data: exchangersCash,
    isFetching: isCashFetching,
    error: cashError,
  } = useGetExchangersQuery(exchangersReq, {
    skip: activeDirection !== directions.cash,
    // добавить сюда currencyCash
  });

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
