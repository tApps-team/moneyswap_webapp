import { useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { AddReview, ReviewList } from "@/features/review";
import { Exchanger, ExchangerDetail } from "@/entities/exchanger";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  ScrollArea,
  ShareButton,
} from "@/shared/ui";
import { Lang } from "@/shared/config";
import { useAppSelector, useDrawerBackButton } from "@/shared/hooks";
import { handleVibration, isTelegramMobile, reachGoal, YandexGoals } from "@/shared/lib";
import styles from "./reviewDrawer.module.scss";

type ReviewDrawerProps = {
  exchanger?: Exchanger;
  review_id?: number;
  /** Drawer открыт сразу, без карточки-триггера: пришли по ссылке на обменник. */
  isFromSite?: boolean;
  /**
   * Сразу раскрыть форму «Добавить отзыв».
   * Отдельно от isFromSite: ссылка с сайта ведёт человека оставлять отзыв, а deep-link
   * на обменник — читать чужие, и форма поверх списка там только мешает.
   */
  autoOpenAddReview?: boolean;
  exchangerDetail?: ExchangerDetail;
};
export const ReviewDrawer = (props: ReviewDrawerProps) => {
  const { exchanger, exchangerDetail, review_id, isFromSite, autoOpenAddReview } = props;
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(isFromSite || false);
  const exchangerName = exchangerDetail ? exchangerDetail?.exchangerName?.ru : i18n.language === Lang.ru ? exchanger?.name?.ru : exchanger?.name?.en;
  // Тот же id, что уходит в AddReview: в списке он лежит в exchange_id, в deep-link — в detail.id.
  const exchangeId = exchangerDetail ? exchangerDetail?.id : exchanger?.exchange_id;

  // telegram open link method
  const tg = window?.Telegram?.WebApp;
  const options = [{ try_instant_view: true }];
  const openLink = (url: string) => {
    try {
      // Сначала пробуем как Telegram ссылку
      tg.openTelegramLink(url);
    } catch (error) {
      // Если не получилось, открываем как обычную ссылку
      tg.openLink(url, options);
    }
  };

  //user info
  const { user, user_id } = useAppSelector((state) => state.user);

  const isMobilePlatform = isTelegramMobile();

  // Используем хук для управления кнопкой назад Telegram
  useDrawerBackButton({
    isOpen,
    onClose: () => setIsOpen(false),
    priority: 1 // Низкий приоритет для родительского drawer
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      {!isFromSite && (
        <DrawerTrigger asChild>
          <div
            className={styles.reviewCountWrapper}
            onClick={(e) => {
              e.stopPropagation();
              handleVibration();
              setIsOpen(true);
              reachGoal(YandexGoals.REVIEWS_OPEN);
            }}
          >
            <p className={styles.reviewTitle}>{t("Отзывы")}</p>
            <div className={styles.reviews}>
              <h3 className={styles.reviewCountPositive}>
                {exchanger?.review_count?.positive}
              </h3>
              <span className={styles.separator}></span>
              <h3 className={styles.reviewCountNeutral}>
                {exchanger?.review_count?.neutral}
              </h3>
              <span className={styles.separator}></span>
              <h3 className={styles.reviewCountNegative}>
                {exchanger?.review_count?.negative}
              </h3>
            </div>
          </div>
        </DrawerTrigger>
      )}
      <DrawerContent
        onClick={(e) => e.stopPropagation()}
        className={clsx("p-0 w-full grid gap-4 bg-[#191C25] border-none", {
          "pt-[90px]": isMobilePlatform
        })}
      >
        <div className="flex justify-between items-center gap-3 mx-4 pt-4">
          <p className="text-[16px] truncate text-white font-semibold min-w-0">
            {exchangerName}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              onClick={() => openLink(exchangerDetail ? exchangerDetail?.url : exchanger?.partner_link || "")}
              target="_blank"
              className="text-[12px] text-mainColor underline"
            >
              {t("reviews.exchanger_link")}
            </a>
            <ShareButton
              params={{ exchanger: String(exchangeId) }}
              label={exchangerName}
              className="size-8"
            />
          </div>
        </div>
        <ScrollArea
          data-vaul-no-drag
          className={clsx("w-full px-4 pb-2 pt-0 h-[calc(100svh_-_60px)]", {
            "h-[calc(100svh_-_160px)]": isMobilePlatform
          })}
        >
          <div className="pb-4">
            <AddReview
              exchange_id={exchangerDetail ? exchangerDetail?.id : exchanger?.exchange_id || 0}
              tg_id={user ? user?.id : user_id}
              isFromSite={Boolean(autoOpenAddReview) && !review_id}
            />
          </div>
          <ReviewList exchanger={exchanger} exchangerDetail={exchangerDetail} isOpen={isOpen} review_id={review_id} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
