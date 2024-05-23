import { directions } from "@/entities/direction";
import {
  useGetExchangersCashQuery,
  useGetExchangersNoncashQuery,
} from "@/entities/exchanger";
import { ExchangerList } from "@/features/exchanger";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Preloader, SystemError } from "@/shared/ui";
import { currencyFormActions } from "@/widgets/currencyForm";
import { FC, useEffect } from "react";
import styles from "./exchangers.module.scss";

interface ExchangersProps {}

export const Exchangers: FC<ExchangersProps> = () => {
  const { city } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const { activeDirection } = useAppSelector((state) => state.direction);
  const { getCashCurrency, getCurrency, giveCashCurrency, giveCurrency } =
    useAppSelector((state) => state.currency);

  const give =
    activeDirection === directions.cash ? giveCashCurrency : giveCurrency;
  const get =
    activeDirection === directions.cash ? getCashCurrency : getCurrency;

  const exchangersCashReq = {
    city: city?.code_name || "",
    valute_from: give?.code_name || "",
    valute_to: get?.code_name || "",
  };
  const exchangersNoncashReq = {
    valute_from: give?.code_name || "",
    valute_to: get?.code_name || "",
  };
  const {
    data: exchangersCash,
    isFetching: isCashFetching,
    error: cashError,
    isSuccess: isCashSuccess,
  } = useGetExchangersCashQuery(exchangersCashReq, {
    skip: activeDirection === directions.noncash || !city || !give || !get,
  });
  const {
    data: exchangersNoncash,
    isFetching: isNoncashFetching,
    error: noncashError,
    isSuccess: isNoCashSuccess,
  } = useGetExchangersNoncashQuery(exchangersNoncashReq, {
    skip: activeDirection === directions.cash || !get || !get,
  });

  useEffect(() => {
    if (isNoCashSuccess) {
      dispatch(currencyFormActions.setNoCashExchangersIsSuccess(true));
    } else {
      dispatch(currencyFormActions.setNoCashExchangersIsSuccess(false));
    }

    if (isCashSuccess) {
      dispatch(currencyFormActions.setCashExchangersIsSuccess(true));
    } else {
      dispatch(currencyFormActions.setCashExchangersIsSuccess(false));
    }
  }, [dispatch, isCashSuccess, isNoCashSuccess]);

  const exchangers =
    activeDirection === directions.cash ? exchangersCash : exchangersNoncash;

  // if (cashError || noncashError) {
  //   dispatch(currencyActions.setGiveCashCurrency(null));
  //   dispatch(currencyActions.setGetCashCurrency(null));
  // }

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
        exchangers &&
        give &&
        get && (
          <ExchangerList
            exchangers={exchangers}
            giveCurrency={give}
            getCurrency={get}
            city={activeDirection === directions.cash ? city : null}
          />
        )
      )}
    </section>
  );
};
