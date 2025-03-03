import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./mainPage.module.scss";
import clsx from "clsx";
import { Exchangers } from "@/widgets/exchangers";
import { Location } from "@/widgets/location";
import { Directions } from "@/widgets/directions";
import { CurrencyForm } from "@/widgets/currencyForm";
import { LanguageSwitcher } from "@/features/languageSwitch";
import { directions, setActiveDirection } from "@/entities/direction";
import { CheckQueries } from "@/features/checkQueries";
import { setUser, setUserId } from "@/entities/user";
import { useAppDispatch } from "@/shared/hooks";
import { Lang } from "@/shared/config";

export const MainPage = () => {
  //check queries
  const dispatch = useAppDispatch();

  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;

  useEffect(() => {
    if (lang && (lang === Lang.ru || lang === Lang.en)) {
      i18n.changeLanguage(lang);
    } else {
      const currentLang = i18n.language.split("-");
      i18n.changeLanguage(currentLang[0]);
    }
  }, []);

  // telegram object
  const tg = window?.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.expand();
      tg.enableClosingConfirmation();
      tg.ready();
      tg?.initDataUnsafe && dispatch(setUser(tg?.initDataUnsafe?.user));
    }
    const activeDirection = CheckQueries().direction || directions.noncash;
    const user_id = Number(CheckQueries().user_id);
    dispatch(setActiveDirection(activeDirection as directions));
    if (user_id) {
      dispatch(setUserId(user_id || null));
    } else if (tg) {
      dispatch(setUserId(tg?.initDataUnsafe?.user?.id || null));
    }
  }, []);

  return (
    <div data-testid="main-page">
      <Suspense fallback={<div>Loading...</div>}>
        <div className={clsx(styles.content, {})}>
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
