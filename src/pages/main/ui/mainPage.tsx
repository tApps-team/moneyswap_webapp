import { useEffect, useState } from "react";
import styles from "./mainPage.module.scss";
import clsx from "clsx";
import { Main } from "@/legacy/components/main";
import { Telegram } from "@/legacy/components/telegram";
import { Preloader } from "@/legacy/components/ui/preloader";
import { MainBg } from "@/legacy/components/ui/mainBg";
import { useAvailableValutesQuery } from "@/entities/currency";

export const MainPage = () => {
  // const [preloaderFinished, setPreloaderFinished] = useState(false);
  // const [preloaderExtro, setPreloaderExtro] = useState(false);

  // // telegram object
  // const tg = window.Telegram.WebApp;

  // useEffect(() => {
  //   // preloader scale and opacity
  //   setTimeout(() => {
  //     setPreloaderExtro(true);
  //   }, 1200);
  //   // webapp 100% height
  //   setTimeout(() => {
  //     tg.expand();
  //   }, 1900);
  //   // preloader ends
  //   setTimeout(() => {
  //     setPreloaderFinished((prev) => !prev);
  //   }, 2250);
  // }, []);

  return (
    <div data-testid="main-page" className="page__wrapper">
      {/* <Telegram /> */}
      {/* {preloaderFinished ? (
        <Main />
      ) : (
        <div
          className={clsx(styles.preloaderContainer, {
            [styles.preloaderFullHeight]: tg.isExpanded,
            [styles.preloaderOpcacity]: preloaderExtro,
          })}
        >
          <Preloader step={25} progress={0} strokeWidth={20} />
        </div>
      )} */}
      <Main />
      {/* <MainBg /> */}
    </div>
  );
};
