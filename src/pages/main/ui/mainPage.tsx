import { useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
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
import { AddReviewFromSite } from "@/features/review/addReview";
import { ExchangerMarker } from "@/shared/types";

export const MainPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;
  // add_review_from_site
  const { tgWebAppStartParam } = CheckQueries();
  const [exchanger_id, exchanger_marker] = tgWebAppStartParam?.split("__") || [];

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

  const shouldShowReviewForm = location.search.includes("tgWebAppStartParam");

  return (
    <div data-testid="main-page">
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen"><Loader className="animate-spin size-6 text-mainColor" /></div>
        }>
        {shouldShowReviewForm ? (
          <AddReviewFromSite
            exchange_id={+exchanger_id}
            exchange_marker={exchanger_marker as ExchangerMarker}
          />
        ) : (
          <div className={clsx(styles.content, {})}>
            <Directions />
            <Location />
            <CurrencyForm />
            <Exchangers />
            <LanguageSwitcher />
          </div>
        )}
      </Suspense>
    </div>
  );
};
