import { Suspense, useEffect } from "react";
import styles from "./mainPage.module.scss";
import clsx from "clsx";
import { TelegramApi } from "@/widgets/telegramApi";
import { Exchangers } from "@/widgets/exchangers";
import { Location } from "@/widgets/location";
import { Directions } from "@/widgets/directions";
import { CurrencyForm } from "@/widgets/currencyForm";
import { LanguageSwitcher } from "@/features/languageSwitch";
import { useAppDispatch } from "@/shared/hooks";
import { directions, setActiveDirection } from "@/entities/direction";
import { LanguageDetector } from "@/features/languageDetector";
import { CheckQueries } from "@/features/checkQueries";
import { setUserId } from "@/entities/user";

export const MainPage = () => {
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
    tg.expand();
  }, []);

  return (
    <div data-testid="main-page">
      <TelegramApi />
      <Suspense fallback={<div>Loading...</div>}>
        <div className={clsx(styles.content, {})}>
          <LanguageDetector />
          <Directions />
          <Location />
          <CurrencyForm />
          <Exchangers />
          <LanguageSwitcher />
        </div>
      </Suspense>
    </div>
  );
};
