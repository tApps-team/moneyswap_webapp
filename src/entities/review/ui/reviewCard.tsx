import { Card, CardContent, CardHeader } from "@/shared/ui";
import { Grade, Review } from "../model/types/reviewType";
import { cx } from "class-variance-authority";
import { formatDate } from "@/shared/lib";

type ReviewCardProps = {
  review: Review;
};
export const ReviewCard = (props: ReviewCardProps) => {
  const { review } = props;
  return (
    <Card
      className={cx(
        "rounded-2xl w-full border-2 h-52 border-lightGray overflow-hidden bg-darkGray relative",
        review.grade === Grade.positive && "border-mainColor"
      )}
    >
      <div>
        <div
          className={cx(
            "w-32 h-8 rounded-bl-3xl rounded-tr-xl absolute top-0 right-0",
            review.grade === Grade.neutral && "bg-lightGray"
          )}
        >
          <div className="text-center">{review.grade}</div>
        </div>
      </div>
      <CardHeader className="mt-4">
        <div className="flex justify-between">
          <div className="text-white">{review.username}</div>
          <div className="text-lightGray">
            {formatDate(review.review_date)} / {review.review_time}
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <p className="overflow-hidden text-ellipsis">{review.text}</p>
      </CardContent>
    </Card>
  );
};
