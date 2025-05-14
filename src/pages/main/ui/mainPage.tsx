import { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import clsx from "clsx";
import { Exchangers } from "@/widgets/exchangers";
import { Location } from "@/widgets/location";
import { Directions } from "@/widgets/directions";
import { CurrencyForm } from "@/widgets/currencyForm";
import { ReviewDrawer } from "@/widgets/reviewDrawer";
import { LanguageSwitcher } from "@/features/languageSwitch";
import { CheckQueries } from "@/features/checkQueries";
import { AddReviewFromSite } from "@/features/review";
import { directions, setActiveDirection } from "@/entities/direction";
import { setUser, setUserId } from "@/entities/user";
import { DirectionMarker } from "@/entities/exchanger";
import { useAppDispatch } from "@/shared/hooks";
import { Lang } from "@/shared/config";
import { ExchangerMarker } from "@/shared/types";
import styles from "./mainPage.module.scss";

export const MainPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;
  // add_review_from_site_with_tg_web_app_start_param
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
  const review_id = 1;
  const mockExchanger = {
    id: 1,
    name: {
      ru: "Test Exchanger",
      en: "Test Exchanger"
    },
    exchange_id: 123,
    exchange_marker: ExchangerMarker.no_cash,
    is_vip: false,
    partner_link: "https://test.com",
    valute_from: "USD",
    icon_valute_from: "usd-icon",
    valute_to: "EUR",
    icon_valute_to: "eur-icon",
    in_count: 100,
    out_count: 95,
    min_amount: "100",
    max_amount: "10000",
    review_count: {
      positive: 50,
      neutral: 30,
      negative: 20
    },
    info: {
      bankomats: null,
      delivery: true,
      office: true,
      working_days: {
        Пн: true,
        Вт: true,
        Ср: true,
        Чт: true,
        Пт: true,
        Сб: false,
        Вс: false
      },
      weekdays: { time_from: "09:00", time_to: "18:00" },
      weekends: { time_from: "10:00", time_to: "16:00" },
      high_aml: false
    },
    params: "test_params",
    fromfee: 0,
    exchange_rates: null,
    exchange_direction_id: 1,
    direction_marker: DirectionMarker.no_cash
  }

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
            {review_id && <ReviewDrawer exchanger={mockExchanger} review_id={review_id} />}
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
