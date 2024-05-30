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
import {
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
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
    if (inView && page < reviews?.pages) {
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
      tabName: t("ВСЕ"),
      tabReviewValue:
        exchanger?.review_count.negative +
        exchanger?.review_count.neutral +
        exchanger?.review_count.positive,
    },
    {
      tabValue: Grade.positive,
      tabName: t("ПОЛОЖИТЕЛЬНЫЕ"),
      tabReviewValue: exchanger?.review_count.positive,
    },
    {
      tabValue: Grade.neutral,
      tabName: t("НЕЙТРАЛЬНЫЕ"),
      tabReviewValue: exchanger?.review_count.neutral,
    },
    {
      tabValue: Grade.negative,
      tabName: t("ОТРИЦАТЕЛЬНЫЕ"),
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
        className=""
      >
        <TabsList className="bg-transparent grid grid-rows-2 grid-cols-2 gap-2 h-full ">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.tabValue}
              className="rounded-3xl bg-darkGray   uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white border-2 h-11 data-[state=active]:bg-mainColor"
              value={String(tab.tabValue)}
            >
              <div className="flex truncate items-center gap-1">
                <p className="truncate text-xs">{tab.tabName}</p>
                <p className=" text-xs">({tab.tabReviewValue})</p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabItems.map((tab) => (
          <TabsContent key={tab.tabValue} value={String(tab.tabValue)}>
            <ScrollArea className=" h-[70svh] w-full p-2">
              <div className="grid items-center gap-2">
                {reviews?.content.map((review, index) => (
                  <ReviewCard
                    ref={reviews.content.length - 1 === index ? ref : null}
                    key={review.id}
                    review={review}
                  />
                ))}
                {isFetching && (
                  <div className="flex justify-center items-center ">
                    <Loader
                      color="#F6FF5F"
                      className="fill-mainColor  animate-spin h-12 w-12"
                    />
                  </div>
                )}
              </div>

              <ScrollBar className="" />
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
