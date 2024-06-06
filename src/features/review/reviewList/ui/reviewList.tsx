import { Exchanger } from "@/entities/exchanger";
import {
  Grade,
  ReviewCard,
  useReviewsByExchangeQuery,
} from "@/entities/review";
import { selectCacheByKey } from "@/entities/review/api/reviewApi";
import { CommentList } from "@/features/comment";
import { Empty, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { Comment } from "@/widgets/comment";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
type ReviewListProps = {
  exchanger: Exchanger;
  isOpen?: boolean;
};
export const ReviewList = (props: ReviewListProps) => {
  const { exchanger, isOpen } = props;
  const { t } = useTranslation();
  const [grade, setGrade] = useState<Grade>(Grade.all);
  const cachePage = useSelector(
    selectCacheByKey(exchanger?.exchange_id, grade)
  );
  const [page, setPage] = useState<number>(cachePage?.page || 1);

  const { ref, inView, entry } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const {
    data: reviews,
    isLoading: reviewsIsLoading,
    isFetching,
  } = useReviewsByExchangeQuery(
    {
      exchange_id: exchanger.exchange_id,
      exchange_marker: exchanger.exchange_marker,
      page: page,
      element_on_page: 4,
      grade_filter: grade === Grade.all ? undefined : grade,
    },
    {
      skip: !isOpen,
    }
  );

  // console.log(
  //   exchanger?.review_count[Grade[grade] as keyof typeof exchanger.review_count]
  // );
  useEffect(() => {
    if (reviews?.pages && inView && cachePage?.page < reviews?.pages) {
      setPage((prev) => (cachePage?.page ? cachePage?.page + 1 : prev + 1));
    }
  }, [inView]);

  const tabItems: {
    tabValue: Grade;
    tabName: string;
    tabReviewValue: number;
  }[] = [
    {
      tabValue: Grade.all,
      tabName: t("reviews.grade.all"),
      tabReviewValue:
        exchanger?.review_count.negative +
        exchanger?.review_count.neutral +
        exchanger?.review_count.positive,
    },
    {
      tabValue: Grade.positive,
      tabName: t("reviews.grade.positive"),
      tabReviewValue: exchanger?.review_count.positive,
    },
    {
      tabValue: Grade.neutral,
      tabName: t("reviews.grade.neutral"),
      tabReviewValue: exchanger?.review_count.neutral,
    },
    {
      tabValue: Grade.negative,
      tabName: t("reviews.grade.negative"),
      tabReviewValue: exchanger?.review_count.negative,
    },
  ];

  return (
    <div>
      <Tabs
        defaultValue="all"
        onValueChange={(e) => {
          setPage(1);
          setGrade(e as Grade);
        }}
        className="grid gap-4"
      >
        <TabsList className="bg-transparent grid grid-rows-2 grid-cols-2 gap-2 h-full w-[90%] mx-auto px-0 py-0">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab?.tabValue}
              className="rounded-3xl bg-darkGray border-lightGray uppercase text-white data-[state=active]:text-black data-[state=active]:border-mainColor border-2 h-full data-[state=active]:bg-mainColor"
              value={String(tab?.tabValue)}
            >
              <div className="flex truncate items-center gap-1 text-[10px]">
                <p className="truncate">{tab?.tabName}</p>
                <p className="">({tab?.tabReviewValue})</p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabItems?.map((tab) => (
          <TabsContent
            key={tab.tabValue}
            value={String(tab?.tabValue)}
            className="m-0"
          >
            {reviews?.content?.length ? (
              <div className="grid gap-4">
                {reviews?.content?.map((review, index) => (
                  <ReviewCard
                    ref={reviews?.content?.length - 1 === index ? ref : null}
                    key={review?.id}
                    review={review}
                    exchangerInfo={exchanger}
                    // CommentSlot={<Comment review={review} />}
                  />
                ))}
              </div>
            ) : (
              <div className="grid justify-items-center gap-6 mt-8">
                <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
                <Empty text={t("Ничего не найдено...")} />
              </div>
            )}
            {isFetching && (
              <div className="flex justify-center items-center ">
                <Loader
                  color="#F6FF5F"
                  className="fill-mainColor mt-4 animate-spin h-8 w-8"
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
