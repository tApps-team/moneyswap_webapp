import { formatDate } from "@/shared/lib";
import { Card } from "@/shared/ui";
import { cx } from "class-variance-authority";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Grade, Review } from "../model/types/reviewType";
import { useTranslation } from "react-i18next";
import { CommentIcon } from "@/shared/assets";
import { CommentList } from "@/features/comment";
import { Exchanger } from "@/entities/exchanger";

type ReviewCardProps = {
  review: Review;
  exchangerInfo: Pick<Exchanger, "exchange_id" | "exchange_marker">;
};

export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  (props, ref) => {
    const { review, exchangerInfo } = props;
    const { t } = useTranslation();
    const gradeName =
      review?.grade === Grade.positive
        ? t("reviews.grade.positive")
        : review?.grade === Grade.neutral
        ? t("reviews.grade.neutral")
        : t("reviews.grade.negative");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showMore, setShowMore] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      if (textRef.current) {
        const lineHeight = parseFloat(
          getComputedStyle(textRef.current).lineHeight
        );
        const totalHeight = textRef.current.scrollHeight;
        const lines = Math.floor(totalHeight / lineHeight);
        setIsOverflowing(lines > 4);
      }
    }, [review?.text]);

    return (
      <div>
        <Card
          ref={ref}
          className={cx(
            "rounded-[25px] w-full border-2 border-lightGray overflow-hidden text-black bg-darkGray relative transition-all z-1",
            review?.grade === Grade.positive && "border-mainColor"
          )}
        >
          <div
            className={cx(
              "w-[40%] p-2 pl-3 flex justify-center items-center rounded-bl-3xl rounded-tr-xl absolute top-0 right-0 border-2 border-t-0 border-r-0",
              review?.grade === Grade.positive
                ? "bg-mainColor border-none"
                : review?.grade === Grade.neutral
                ? "bg-lightGray border-none"
                : "bg-darkGray border-[2px] border-lightGray"
            )}
          >
            <div
              className={cx(
                "text-center truncate text-[9px] uppercase font-medium",
                review?.grade === Grade.negative && "text-lightGray"
              )}
            >
              {gradeName}
            </div>
          </div>
          <div className="p-3 pl-4">
            <p className="text-white uppercase text-[14px] truncate w-[60%]">
              {review?.username}
            </p>
            <p className="text-lightGray font-light text-[12px] uppercase">
              {formatDate(review?.review_date)} / {review?.review_time}
            </p>
          </div>
          <div
            className={cx(
              "p-0 relative",
              showMore ? "h-auto" : "h-[74px] overflow-hidden"
            )}
          >
            <p
              ref={textRef}
              className={cx("text-white text-[12px] font-normal relative px-6")}
            >
              {review?.text}
              {showMore && (
                <span className="uppercase pl-4 opacity-0">
                  {t("reviews.show_less")}
                </span>
              )}
              <span className="absolute left-4 top-0 w-[2px] rounded-md bg-lightGray h-full"></span>
            </p>
            {isOverflowing && (
              <span
                onClick={() => setShowMore(!showMore)}
                className={cx(
                  "bg-darkGray cursor-pointer text-[12px] uppercase text-mainColor pl-4 absolute bottom-0 right-4"
                )}
              >
                {!showMore && (
                  <span className="text-white absolute left-0 bottom-[2px]">
                    ...
                  </span>
                )}
                {showMore ? t("reviews.show_less") : t("reviews.show_more")}
              </span>
            )}
          </div>
          <div
            className={cx(
              "p-4 pt-2 flex  ",
              review?.comment_count < 1 && "pointer-events-none"
            )}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <CommentIcon
              width={"20px"}
              fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
            />
            <p className="text-[9px] text-lightGray font-light uppercase ml-2 mt-[1px]">
              {t("reviews.show_comments")} ({review?.comment_count})
            </p>
          </div>
        </Card>
        <CommentList
          commentCount={review?.comment_count}
          exchangerInfo={exchangerInfo}
          reviewId={review?.id}
          isOpen={isOpen}
        />
      </div>
    );
  }
);
