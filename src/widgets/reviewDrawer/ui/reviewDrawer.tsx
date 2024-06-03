import { Exchanger } from "@/entities/exchanger";
import { AddReview, ReviewList } from "@/features/review";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  ScrollArea,
} from "@/shared/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./reviewDrawer.module.scss";
import { Lang } from "@/shared/config";
import { CloseDrawerIcon, LogoBig } from "@/shared/assets";
type ReviewDrawerProps = {
  exchanger: Exchanger;
};
export const ReviewDrawer = (props: ReviewDrawerProps) => {
  const { exchanger } = props;
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const exchangerName =
    i18n.language === Lang.ru ? exchanger?.name?.ru : exchanger?.name?.en;

  // telegram open link method
  const tg = window.Telegram.WebApp;
  const options = [{ try_instant_view: true }];
  const isTelegramLink = (url: string): boolean => {
    const telegramLinkPattern = /(?:t\.me|telegram\.me)\/[^/\s]+\/?$/;
    return telegramLinkPattern.test(url);
  };
  const openLink = (url: string) => {
    if (isTelegramLink(url)) {
      tg.openTelegramLink(url);
    } else {
      tg.openLink(url, options);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <div
          className={styles.reviewCountWrapper}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <p className={styles.reviewTitle}>{t("Отзывы")}</p>
          <div className={styles.reviews}>
            <h3 className={styles.reviewCountPositive}>
              {exchanger?.review_count?.positive}
            </h3>
            <span className={styles.separator}></span>
            <h3 className={styles.reviewCountNegative}>
              {exchanger?.review_count?.neutral}
            </h3>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent
        onClick={(e) => e.stopPropagation()}
        className="min-h-svh p-0 w-full grid gap-4 bg-transparent border-none"
      >
        <DrawerHeader className="relative grid grid-flow-col justify-between items-center gap-3 h-11">
          <DrawerClose className="absolute left-2 top-5 grid gap-2 grid-flow-col items-center">
            <div className="rotate-90">
              <CloseDrawerIcon width={22} height={22} fill={"#fff"} />
            </div>
            <p className="text-[14px] uppercase text-white font-medium">
              {t("reviews.title")}
            </p>
          </DrawerClose>
          <div className="absolute right-2 top-4">
            <LogoBig width={130} />
          </div>
        </DrawerHeader>
        <div className="grid grid-flow-col justify-between items-center gap-3 mx-4 pt-4 border-t-2 border-mainColor">
          <p className="text-[16px] truncate text-white font-medium uppercase">
            {exchangerName}
          </p>
          <a
            onClick={() => openLink(exchanger?.partner_link)}
            target="_black"
            className="text-[12px] text-mainColor underline"
          >
            {t("reviews.exchanger_link")}
          </a>
        </div>
        <ScrollArea
          data-vaul-no-drag
          className="h-[calc(100svh_-_118px)] w-full px-4 pb-2 pt-0"
        >
          <div className="pb-4 sticky top-0 z-50 bg-darkGray">
            <AddReview
              exchange_id={exchanger?.exchange_id}
              exchange_marker={exchanger?.exchange_marker}
              tg_id={686339126}
            />
          </div>
          <ReviewList exchanger={exchanger} isOpen={isOpen} />
        </ScrollArea>
        {/* <AddReview
              exchange_id={exchanger?.exchange_id}
              exchange_marker={exchanger?.exchange_marker}
              tg_id={686339126}
            />
          <ReviewList exchanger={exchanger} isOpen={isOpen} /> */}
      </DrawerContent>
    </Drawer>
  );
};
