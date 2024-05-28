import { Exchanger } from "@/entities/exchanger";
import {
  Grade,
  Review,
  ReviewCard,
  useLazyReviewsByExchangeQuery,
  useReviewsByExchangeQuery,
} from "@/entities/review";
import { selectCacheByKey } from "@/entities/review/api/reviewApi";
import { baseApi } from "@/shared/api";
import { ScrollArea, ScrollBar } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
type ReviewListProps = {
  exchanger: Exchanger;
  isOpen?: boolean;
};
export const ReviewList = (props: ReviewListProps) => {
  const { exchanger, isOpen } = props;
  const cachePage = useSelector(selectCacheByKey(exchanger?.exchange_id));
  const [page, setPage] = useState<number>(cachePage || 1);
  const { ref, inView, entry } = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  const { data: reviews } = useReviewsByExchangeQuery(
    {
      exchange_id: exchanger.exchange_id,
      exchange_marker: exchanger.exchange_marker,
      page: page,
      element_on_page: 3,
      grade_filter: Grade.neutral,
    },
    {
      skip: !isOpen,
    }
  );

  return (
    <ScrollArea className="w-full p-2">
      <div className="grid gap-2">
        {reviews?.content.map((review) => (
          <ReviewCard ref={ref} key={review.id} review={review} />
        ))}
      </div>
      <ScrollBar className="" />
    </ScrollArea>
  );
};
