import { Exchanger } from "@/entities/exchanger";
import { Grade, useReviewsByExchangeQuery } from "@/entities/review";
import { AddReview, ReviewList } from "@/features/review";
import { useAppSelector } from "@/shared/hooks";
import { Drawer, DrawerContent, DrawerTrigger } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import styles from "./reviewDrawer.module.scss";
import { useState } from "react";
type ReviewDrawerProps = {
  exchanger: Exchanger;
};
export const ReviewDrawer = (props: ReviewDrawerProps) => {
  const { exchanger } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const activeExchanger = useAppSelector((state) => state.exchanger.exchanger);
  console.log(isOpen, exchanger);
  const { data: reviews } = useReviewsByExchangeQuery(
    {
      exchange_id: exchanger.exchange_id,
      exchange_marker: exchanger.exchange_marker,
      page: 1,
      element_on_page: 10,
      grade_filter: Grade.neutral,
    },
    {
      skip: !isOpen,
    }
  );
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
        className="h-svh p-2 w-full grid gap-5 bg-transparent"
      >
        <AddReview
          exchange_id={exchanger?.exchange_id}
          exchange_marker={exchanger?.exchange_marker}
          tg_id={686339126}
        />
        <ReviewList reviews={reviews?.content} />
      </DrawerContent>
    </Drawer>
  );
};
