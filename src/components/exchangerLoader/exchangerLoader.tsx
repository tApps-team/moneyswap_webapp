import { memo, useEffect, useState } from "react";
import { Exchanger } from "../../model/Exchanger";
import { ExchangersList } from "../exchangersList";
import styles from "./exchangerLoader.module.scss";
import { SystemError } from "../ui/systemError";
import { Preloader } from "../ui/preloader";

type ExchangerLoaderProps = {
  isLoading: boolean;
  isFetching: boolean;
  exchangers: Exchanger[] | undefined;
  error: unknown;
};
export const ExchangerLoader = memo((props: ExchangerLoaderProps) => {
  const { error, exchangers, isFetching, isLoading } = props;
  // const [progress, setProgress] = useState(0);
  // useEffect(() => {
  //   let prevProgress = 0;

  //   const interval = setInterval(() => {
  //     const randomIncrement = Math.ceil(Math.random() * 10);
  //     const newProgress = Math.min(prevProgress + randomIncrement, 100);

  //     setProgress(newProgress);

  //     prevProgress = newProgress;
  //   }, 100);
  //   if (prevProgress === 100) setProgress(0);
  //   setTimeout(() => {
  //     clearInterval(interval);
  //   }, 3500);

  //   return () => clearInterval(interval);
  // }, [isLoading, isFetching]);
  // console.log(progress);
  return (
    <section className={styles.exchangers}>
      {isLoading || isFetching ? (
        <div className={styles.preloaderWrapper}>
          <Preloader
            className={styles.preloader}
            progress={0}
            strokeWidth={20}
          />
        </div>
      ) : error ? (
        <div>
          <SystemError direction={true} />
        </div>
      ) : (
        exchangers && <ExchangersList exchangers={exchangers} />
      )}
    </section>
  );
});
