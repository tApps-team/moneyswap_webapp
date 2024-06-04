import { Review, useLazyCommentsByReviewQuery } from "@/entities/review";
import { CommentIcon } from "@/shared/assets";
import { useState } from "react";
import { useTranslation } from "react-i18next";
type CommentProps = {
  review: Review;
};
export const Comment = (props: CommentProps) => {
  const { review } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [commentsByReviewQuery] = useLazyCommentsByReviewQuery();
  return (
    <div className="p-4 pt-2 flex" onClick={() => setIsOpen((prev) => !prev)}>
      <CommentIcon
        width={"20px"}
        fill={review?.comment_count > 0 ? "#F6FF5F" : "#BBB"}
      />
      <p className="text-[9px] text-lightGray font-light uppercase ml-2 mt-[1px]">
        {t("reviews.show_comments")} ({review?.comment_count})
      </p>
    </div>
  );
};
