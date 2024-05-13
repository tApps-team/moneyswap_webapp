import styles from "./exchangers.module.scss";
import { useTranslation } from "react-i18next";
import { Exchanger, useGetExchangersQuery } from "@/entities/exchanger";
import { useAppSelector } from "@/shared/hooks";
import { Preloader, SystemError } from "@/shared/ui";
import { ExchangerList } from "@/features/exchanger";
import { FC } from "react";

interface ExchangersProps {
  exchangers: Exchanger[];
  isFetching: boolean;
  error: any;
}

export const Exchangers: FC<ExchangersProps> = ({
  exchangers,
  isFetching,
  error,
}) => {
  const { t } = useTranslation();
  const { city } = useAppSelector((state) => state.location);
  // тут отправлять запрос на exchangers и сделать skip: !give && !get && directions === directions.cash && !city
  // const exchangersReq = {
  //   city: city?.code_name,
  //   valute_from: "dsfsdf",
  //   valute_to: "sdfsdf",
  // };
  // const {
  //   data: exchangers,
  //   isFetching,
  //   error,
  // } = useGetExchangersQuery(exchangersReq);
  // // const exchangers: Exchanger[] = [];

  return (
    <section className={styles.exchangers}>
      {isFetching ? (
        <div className={styles.preloaderWrapper}>
          <Preloader
            className={styles.preloader}
            progress={0}
            strokeWidth={20}
            step={30}
          />
        </div>
      ) : error ? (
        <SystemError direction={true} />
      ) : (
        exchangers && (
          <ExchangerList
            exchangers={exchangers!}
            currencyGive={{ name: "sdfsdf" }}
            currencyGet={{ name: "sdfsdf" }}
            city={city && city}
          />
        )
      )}
    </section>
  );
};
