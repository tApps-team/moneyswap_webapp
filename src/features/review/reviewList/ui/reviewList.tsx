import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CircleX, Loader } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Exchanger, ExchangerDetail } from "@/entities/exchanger";
import {
  ReviewCard,
  useReviewsByExchangeQuery,
  selectCacheByKey
} from "@/entities/review";
import { Grade } from "@/shared/types";
import { Empty, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

type ReviewListProps = {
  exchanger?: Exchanger;
  exchangerDetail?: ExchangerDetail;
  isOpen?: boolean;
  review_id?: number;
};
export const ReviewList = (props: ReviewListProps) => {
  const { exchanger, exchangerDetail, isOpen, review_id } = props;
  const { t } = useTranslation();
  const [oneReview, setOneReview] = useState<boolean>(review_id ? true : false);
  const [grade, setGrade] = useState<Grade>(Grade.all);
  const cachePage = useSelector(
    selectCacheByKey(exchangerDetail ? exchangerDetail?.exchangerName?.ru : exchanger?.name?.ru || "", grade)
  );
  const [page, setPage] = useState<number>(cachePage?.page || 1);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const {
    data: reviews,
    isFetching,
    refetch
  } = useReviewsByExchangeQuery(
    {
      exchange_name: exchangerDetail ? exchangerDetail?.exchangerName?.ru : exchanger?.name?.ru || "",
      review_id: oneReview ? review_id : undefined,
      page: page,
      element_on_page: 10,
      grade_filter: grade === Grade.all ? undefined : grade,
    },
    {
      skip: !isOpen,
    }
  );


  // асинхронная функция для смены режима просмотра отзывов
  const seeAllReviews = async () => {
    await Promise.all([
      new Promise<void>(resolve => {
        setOneReview(false);
        resolve();
      }),
      new Promise<void>(resolve => {
        setPage(1);
        resolve();
      })
    ]);
    await refetch();
  }

  useEffect(() => {
    if (reviews?.pages && inView) {
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
      tabReviewValue: exchangerDetail ? 
        exchangerDetail?.reviews.negative +
        exchangerDetail?.reviews.neutral +
        exchangerDetail?.reviews.positive : exchanger ? exchanger?.review_count.negative +
        exchanger?.review_count.neutral +
        exchanger?.review_count.positive : 0,
    },
    {
      tabValue: Grade.positive,
      tabName: t("reviews.grade.positive"),
      tabReviewValue: exchangerDetail ? 
        exchangerDetail?.reviews.positive : exchanger?.review_count.positive || 0,
    },
    {
      tabValue: Grade.neutral,
      tabName: t("reviews.grade.neutral"),
      tabReviewValue: exchangerDetail ? 
        exchangerDetail?.reviews.neutral : exchanger?.review_count.neutral || 0,
    },
    {
      tabValue: Grade.negative,
      tabName: t("reviews.grade.negative"),
      tabReviewValue: exchangerDetail ? 
        exchangerDetail?.reviews.negative : exchanger?.review_count.negative || 0,
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
        <TabsList className="bg-transparent h-auto flex flex-wrap gap-2 w-[90%] mx-auto px-0 py-0">
          {oneReview ? (
            <div 
              className="bg-new-light-grey rounded-[10px] py-2 px-3 flex items-center gap-2 text-mainColor text-xs font-semibold cursor-pointer" 
              onClick={seeAllReviews}
            >
              {t("reviews.all_reviews")}
              <CircleX className="size-4" />
            </div>
          ) : (
            <>
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab?.tabValue}
                  className="rounded-[7px] font-medium bg-new-medium-grey text-white data-[state=active]:text-black leading-none data-[state=active]:bg-mainColor"
                  value={String(tab?.tabValue)}
                >
                  <div className="flex truncate items-center gap-1 text-[12px]">
                    <p className="truncate">{tab?.tabName}</p>
                    <p className="">({tab?.tabReviewValue})</p>
                  </div>
                </TabsTrigger>
              ))}
            </>
          )}
        </TabsList>
        {tabItems?.map((tab) => (
          <TabsContent
            key={tab.tabValue}
            value={String(tab?.tabValue)}
            className="m-0"
          >
            {reviews?.content?.length ? (
              <div className="grid gap-4">
                {oneReview ? (
                  <ReviewCard
                    ref={ref}
                    key={reviews?.content[0]?.id}
                    review={reviews?.content[0]}
                    seeAllReviews={seeAllReviews}
                  />
                ) : (
                  reviews?.content?.map((review, index) => (
                    <ReviewCard
                      ref={reviews?.content?.length - 1 === index ? ref : null}
                      key={`${review?.id}-${index}`}
                      review={review}
                      seeAllReviews={seeAllReviews}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="grid justify-items-center gap-6 mt-8">
                <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
                <Empty text={t("Ничего не найдено...")} />
              </div>
            )}
            {isFetching && (
              <div className="flex justify-center items-center mt-4">
                <Loader
                  color="#F6FF5F"
                  className="fill-mainColor animate-spin h-8 w-8"
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
