import { Review } from "@/entities/review";
import { CommentList } from "@/features/comment";
import { CommentIcon } from "@/shared/assets";
import { cx } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
type CommentProps = {
  review: Review;
};
export const Comment = (props: CommentProps) => {
  const { review } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [commentsByReviewQuery] = useLazyCommentsByReviewQuery();
  return (
    <div
      className="p-4 pt-2 relative "
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <div className="flex">
        <CommentIcon
          width={"20px"}
          fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
        />
        <p className="text-[9px] text-lightGray font-light uppercase ml-2 mt-[1px]">
          {t("reviews.show_comments")} ({review?.comment_count})
        </p>
      </div>
      <div
        className={cx(
          "relative w-full bg-mainColor text-black transition-opacity p-4 pt-[40px] rounded-b-[30px] z-[-1]",
          isOpen
            ? "-translate-y-[30px] -mb-[30px] opacity-1"
            : "translate-y-[-100%] h-[50px] opacity-0 hidden"
        )}
      >
        <CommentList />
      </div>
    </div>
  );
};
