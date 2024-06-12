import { useCommentsByReviewQuery } from "@/entities/comment";
import { Exchanger } from "@/entities/exchanger";
import { Review } from "@/entities/review";
import { CommentList } from "@/features/comment";
import { CommentIcon } from "@/shared/assets";
import { cx } from "class-variance-authority";
import { Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
type CommentProps = {
  review: Review;
  exchangerInfo: Pick<Exchanger, "exchange_id" | "exchange_marker">;
};
export const Comment = (props: CommentProps) => {
  const { review, exchangerInfo } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [commentIsLoading, setCommentIsLoading] = useState(false);
  // const { data: comments, isLoading } = useCommentsByReviewQuery(
  //   {
  //     review_id: review.id,
  //     exchange_id: exchangerInfo?.exchange_id,
  //     exchange_marker: exchangerInfo?.exchange_marker,
  //   },
  //   { skip: !isOpen || review.comment_count < 1 }
  // );
  const onHandleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  return (
    <div className=" bg-mainColor">
      <div
        className={cx(
          "px-4  rounded-b-3xl bg-darkGray  py-2 flex  ",
          commentIsLoading && "items-center justify-center",
          review?.comment_count < 1 && "pointer-events-none",
          isOpen && "border-b-2"
        )}
        onClick={onHandleClick}
      >
        {commentIsLoading ? (
          <div className="flex justify-center items-center mb-2 ">
            <Loader color="#F6FF5F" className="animate-spin  " />
          </div>
        ) : (
          <>
            <CommentIcon
              width={"20px"}
              fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
            />
            <p className="text-[9px] text-lightGray font-light uppercase ml-2 mt-[1px]">
              {t("reviews.show_comments")} ({review?.comment_count})
            </p>
          </>
        )}
      </div>

      <CommentList
        // comments={comments || []}
        // isLoading={isLoading}
        onLoadingChange={setCommentIsLoading}
        commentCount={review.comment_count}
        exchangerInfo={exchangerInfo}
        isOpen={isOpen}
        reviewId={review.id}
      />
    </div>
  );
};
