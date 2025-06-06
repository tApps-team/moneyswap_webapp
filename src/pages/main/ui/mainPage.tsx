import { Suspense, useEffect } from "react";
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
import { directions, setActiveDirection } from "@/entities/direction";
import { setUser, setUserId } from "@/entities/user";
import { useGetExchangerDetailQuery } from "@/entities/exchanger";
import { ExchangerMarker } from "@/shared/types";
import { useAppDispatch } from "@/shared/hooks";
import { Lang } from "@/shared/config";
import styles from "./mainPage.module.scss";

export const MainPage = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;

  // from_site
  const { from_site } = CheckQueries();
  const [exchanger_id, exchanger_marker, review_id] = from_site?.split("__") || [];

  const {data: exchangerDetailData, isSuccess: isExchangerDetailSuccess} = useGetExchangerDetailQuery({exchange_id: +exchanger_id, exchange_marker: exchanger_marker as ExchangerMarker}, {skip: !exchanger_id});

  const exchangerDetail = exchangerDetailData ? {
    ...exchangerDetailData,
    exchange_id: +exchanger_id,
    exchange_marker: exchanger_marker as ExchangerMarker,
  } : undefined;

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
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen"><Loader className="animate-spin size-6 text-mainColor" /></div>
        }>
          <div className={clsx(styles.content, {})}>
            {from_site && isExchangerDetailSuccess && <ReviewDrawer exchangerDetail={exchangerDetail} review_id={+review_id} isFromSite={true} />}
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
