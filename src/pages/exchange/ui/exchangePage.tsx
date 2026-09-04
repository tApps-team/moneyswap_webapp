import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import clsx from "clsx";
import { Exchangers } from "@/widgets/exchangers";
import { Location } from "@/widgets/location";
import { Directions } from "@/widgets/directions";
import { CurrencyForm } from "@/widgets/currencyForm";
import { ReviewDrawer } from "@/widgets/reviewDrawer";
import { CheckQueries } from "@/features/checkQueries";
import { useDeepLinkPair } from "@/features/deepLinkPair";
import { directions, setActiveDirection } from "@/entities/direction";
import { setUser, setUserId } from "@/entities/user";
import { ExchangerDetail, useGetExchangerDetailQuery } from "@/entities/exchanger";
import { useAppDispatch } from "@/shared/hooks";
import { Lang } from "@/shared/config";
import { reachGoal, YandexGoals } from "@/shared/lib";
import { isTelegramMobile } from "@/shared/lib";
import styles from "./exchangePage.module.scss";

/**
 * Экран обмена — то, чем приложение было до появления нижнего меню.
 * Остаётся смонтированным при переключении вкладок (см. MainPage), поэтому эффекты
 * инициализации Telegram и выбор направления/валют не сбрасываются.
 */
export const ExchangePage = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;

  // Пара обмена и город из ссылки (?give=…&get=…&city=…), в том числе пришедшие через startapp.
  useDeepLinkPair();

  // Drawer обменника: `?exchanger=<id>&review=<id>` — наш deep-link, `?from_site=<id>__<id>` —
  // исторический формат бота и сайта. Оба ведут в один и тот же ReviewDrawer.
  const { from_site, exchanger, review } = CheckQueries();
  const [fromSiteExchangerId, fromSiteReviewId] = from_site?.split("__") || [];
  const exchanger_id = exchanger || fromSiteExchangerId;
  const review_id = review || fromSiteReviewId;

  const {data: exchangerDetailData, isSuccess: isExchangerDetailSuccess, isLoading: isExchangerDetailLoading} = useGetExchangerDetailQuery({exchange_id: +exchanger_id}, {skip: !exchanger_id});

  const exchangerDetail: ExchangerDetail | undefined = exchangerDetailData ? {
    ...exchangerDetailData,
    id: +exchanger_id,
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

      const isMobilePlatform = isTelegramMobile();

      if (tg?.requestFullscreen && isMobilePlatform) {
        tg.requestFullscreen();
      }
    }

    const activeDirection = CheckQueries().direction || directions.noncash;
    const user_id = Number(CheckQueries().user_id);
    dispatch(setActiveDirection(activeDirection as directions));
    if (activeDirection === directions.cash) {
      reachGoal(YandexGoals.SELECT_TYPE_CASH);
    } else {
      reachGoal(YandexGoals.SELECT_TYPE_CASHLESS);
    }
    if (user_id) {
      dispatch(setUserId(user_id || null));
    } else if (tg) {
      dispatch(setUserId(tg?.initDataUnsafe?.user?.id || null));
    }

  }, []);

  const isMobilePlatform = isTelegramMobile();

  return (
    <div data-testid="main-page">
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen"><Loader className="animate-spin size-6 text-mainColor" /></div>
        }>
          <div className={clsx(styles.content, {
            [styles.content_mobile]: isMobilePlatform
          })}>
            {/* autoOpenAddReview только для from_site: с сайта человека ведут оставить отзыв,
                а ?exchanger= — почитать чужие, там форма поверх списка мешает. */}
            {exchanger_id && !isExchangerDetailLoading && isExchangerDetailSuccess && <ReviewDrawer exchangerDetail={exchangerDetail} review_id={review_id ? +review_id : undefined} isFromSite={true} autoOpenAddReview={Boolean(from_site)} />}
            <Directions />
            <Location />
            <CurrencyForm />
            <Exchangers />
          </div>
      </Suspense>
    </div>
  );
};
