import { forwardRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import { cx } from "class-variance-authority";
// refactor
import { AddComment, CommentList } from "@/features/comment";
// refactor
import { Grade } from "@/shared/types";
import { Card } from "@/shared/ui";
import { formatDate } from "@/shared/lib";
import { CommentIcon } from "@/shared/assets";
import { Review } from "../model/types/reviewType";

type ReviewCardProps = {
  review: Review;
  seeAllReviews?: () => void;
};

export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  (props, ref) => {
    const { review, seeAllReviews } = props;
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
    const [commentIsLoading, setCommentIsLoading] = useState(false);

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

    // проверка каждого слова в отзыве на длину, чтобы слово не было длиннее ширины экрана иначе стили ломаются
    const [isBreakall, setIsBreakAll] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
      if (!review?.text) return;

      const words = review.text.split(" ");
      const canvas = canvasRef.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.font = "14px Unbounded";

      const screenWidth = window.innerWidth - 40;

      for (const word of words) {
        const wordWidth = context.measureText(word).width;
        if (wordWidth > screenWidth) {
          setIsBreakAll(true);
          return;
        }
      }

      setIsBreakAll(false);
    }, [review]);

    return (
      <div className="relative ">
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <Card
          ref={ref}
          className={cx(
            "border-none rounded-[10px] w-full h-auto overflow-hidden text-black bg-new-dark-grey relative transition-all z-0"
          )}
        >
          <div
            className={cx(
              "w-[40%] p-2 pl-3 flex justify-center items-center rounded-bl-[10px] rounded-tr-[10px] absolute top-0 right-0 border-2 border-t-0 border-r-0 leading-none",
              review?.grade === Grade.positive
                ? "bg-mainColor border-none"
                : review?.grade === Grade.neutral
                ? "bg-lightGray border-none"
                : "bg-new-light-grey border-none"
            )}
          >
            <div
              className={cx(
                "text-center truncate text-[9px] uppercase font-semibold",
                review?.grade === Grade.negative && "text-lightGray"
              )}
            >
              {gradeName}
            </div>
          </div>
          <div className="p-3 pl-4">
            <p className="text-white uppercase text-[14px] truncate w-[50vw] font-medium">
              {review?.username || "unknown"}
            </p>
            <div className="grid grid-flow-col gap-2 justify-between items-center justify-items-stretch">
            <p className="text-mainColor font-light text-[12px] uppercase">
              {formatDate(review?.review_date)} / {review?.review_time}
              </p>
            </div>
          </div>
          <div
            className={cx(
              "p-0 relative",
              showMore ? "h-auto" : "h-[74px] overflow-hidden"
            )}
          >
            <p
              ref={textRef}
              className={cx(
                "text-white text-[12px] font-normal relative px-6",
                {
                  "break-words": !isBreakall,
                  "break-all": isBreakall,
                }
              )}
            >
              {review?.text}
              {showMore && (
                <span className="uppercase pl-4 opacity-0">
                  {t("reviews.show_less")}
                </span>
              )}
              <span className="absolute left-4 top-0 w-[2px] rounded-md bg-[#414141] h-full"></span>
            </p>
            {isOverflowing && (
              <span
                onClick={() => setShowMore(!showMore)}
                className={cx(
                  " bg-new-dark-grey cursor-pointer text-[10px] uppercase text-mainColor pl-4 absolute bottom-0.5 right-4"
                )}
              >
                {!showMore && (
                  <span className="text-white absolute left-0 bottom-[1px]">
                    ...
                  </span>
                )}
                {showMore ? t("reviews.show_less") : t("reviews.show_more")}
              </span>
            )}
          </div>
          <div className="grid grid-flow-col items-center justify-between gap-2 truncate w-full">
            <div
              className={cx(
                "p-4 rounded-b-[10px] bg-new-dark-grey flex",
                commentIsLoading && "items-center justify-start",
                review?.comment_count < 1 ? "pointer-events-none" : "cursor-pointer"
              )}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {commentIsLoading ? (
                <div className="flex justify-start items-center">
                  <Loader color="#F6FF5F" className="animate-spin size-5" />
                </div>
              ) : (
                <>
                  <div className="size-5">
                    <CommentIcon
                      width={"20px"}
                      fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
                    />
                  </div>
                  <p className="text-[9px] text-lightGray font-normal uppercase ml-2 mt-[1px]">
                    {t("reviews.show_comments")} ({review?.comment_count})
                  </p>
                </>
              )}
            </div>
            <AddComment 
              review_id={review?.id} 
              grade={review?.grade}
              seeAllReviews={seeAllReviews}
            />
          </div>
        </Card>
        <CommentList
          onLoadingChange={setCommentIsLoading}
          reviewId={review?.id}
          isOpen={isOpen}
        />
      </div>
    );
  }
);
