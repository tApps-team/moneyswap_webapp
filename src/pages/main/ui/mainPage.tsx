import { useEffect, useState } from "react";
import styles from "./mainPage.module.scss";
import clsx from "clsx";
import { TelegramApi } from "@/widgets/telegramApi";
import { Exchangers } from "@/widgets/exchangers";
import { Location } from "@/widgets/location";
import { Directions } from "@/widgets/directions";
import { Preloader } from "@/shared/ui";
import { CurrencyForm } from "@/widgets/currencyForm";
import { LanguageSwitcher } from "@/features/languageSwitch";

export const MainPage = () => {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [preloaderExtro, setPreloaderExtro] = useState(false);

  // telegram object
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    // preloader scale and opacity
    setTimeout(() => {
      setPreloaderExtro(true);
    }, 1200);
    // webapp 100% height
    setTimeout(() => {
      tg.expand();
    }, 1900);
    // preloader ends
    setTimeout(() => {
      setPreloaderFinished((prev) => !prev);
    }, 2250);
  }, []);

  return (
    <div data-testid="main-page">
      <TelegramApi />
      {preloaderFinished ? (
        <div
          className={clsx(styles.content, {
            [styles.active_content]: preloaderFinished,
          })}
        >
          <Directions />
          <Location />
          <CurrencyForm />
          <Exchangers />
          <LanguageSwitcher />
        </div>
      ) : (
        <div
          className={clsx(styles.preloaderContainer, {
            [styles.preloaderFullHeight]: tg.isExpanded,
            [styles.preloaderOpcacity]: preloaderExtro,
          })}
        >
          <Preloader step={25} progress={0} strokeWidth={20} />
        </div>
      )}
    </div>
  );
};
