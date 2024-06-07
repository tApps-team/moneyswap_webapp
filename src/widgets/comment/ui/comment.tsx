import { Review } from "@/entities/review";
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
    <div className=" pt-2 " onClick={() => setIsOpen((prev) => !prev)}>
      <div className="pl-4 flex">
        <CommentIcon
          width={"20px"}
          fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
        />
        <p className="text-[9px] text-lightGray font-light uppercase ml-2 mt-[1px]">
          {t("reviews.show_comments")} ({review?.comment_count})
        </p>
      </div>
      <div className={cx("mt-3 ")}>{/* <CommentList isOpen={isOpen} /> */}</div>
    </div>
  );
};
