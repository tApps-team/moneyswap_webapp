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
import { useAppDispatch } from "@/shared/hooks";
import { directions, setActiveDirection } from "@/entities/direction";
import { CheckQueries } from "@/features/checkQueries";
import { setUserId } from "@/entities/user";

export const MainPage = () => {
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const [preloaderExtro, setPreloaderExtro] = useState(false);

  //check queries
  const dispatch = useAppDispatch();
  useEffect(() => {
    const activeDirection = CheckQueries().direction || directions.noncash;
    const user_id = Number(CheckQueries().user_id);
    dispatch(setActiveDirection(activeDirection as directions));
    dispatch(setUserId(user_id || null));
  }, []);

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
    }, 2000);
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
