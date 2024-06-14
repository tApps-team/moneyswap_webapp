import {
  Comment,
  CommentCard,
  useCommentsByReviewQuery,
} from "@/entities/comment";
import { Exchanger } from "@/entities/exchanger";
import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";

type CommentListProps = {
  isOpen: boolean;
  reviewId: number;
  commentCount: number;
  // isLoading: boolean;
  // comments: Comment[];
  onLoadingChange: (isLoading: boolean) => void;
  exchangerInfo: Pick<Exchanger, "exchange_id" | "exchange_marker">;
};

export const CommentList = (props: CommentListProps) => {
  const { reviewId, isOpen, exchangerInfo, commentCount, onLoadingChange } =
    props;
  const [height, setHeight] = useState<undefined | number | string>(
    isOpen ? "auto" : 0
  );
  const { data: comments, isLoading } = useCommentsByReviewQuery(
    {
      review_id: reviewId,
      exchange_id: exchangerInfo?.exchange_id,
      exchange_marker: exchangerInfo?.exchange_marker,
    },
    { skip: !isOpen || reviewId < 1 }
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isLoading) {
      setHeight(ref.current?.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, isLoading]);
  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);
  return (
    <div className="">
      <div
        ref={ref}
        style={{ height }}
        className={cx(
          " -translate-y-[50px] relative z-[-1] duration-500 ease-in-out overflow-hidden rounded-[25px] bg-mainColor",
          height !== 0 && "-mb-[50px]"
        )}
      >
        <div className={cx("p-4 grid first:pt-[50px]")}>
          {comments?.map((comment) => (
            <CommentCard key={comment?.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};
