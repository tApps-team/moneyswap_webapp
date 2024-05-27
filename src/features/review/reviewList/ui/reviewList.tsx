import { Review, ReviewCard } from "@/entities/review";
import { ScrollArea, ScrollBar } from "@/shared/ui";

type ReviewListProps = {
  reviews?: Review[];
};
export const ReviewList = (props: ReviewListProps) => {
  const { reviews } = props;
  return (
    <ScrollArea className="w-full p-2">
      <div className="grid gap-2">
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <ScrollBar className="" />
    </ScrollArea>
  );
};
