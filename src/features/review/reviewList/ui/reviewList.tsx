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
  const cachePage = useSelector(selectCacheByKey(exchanger?.exchange_id));
  const [page, setPage] = useState<number>(cachePage?.page || 1);
  console.log(cachePage?.content);
  const { ref, inView, entry } = useInView({
    threshold: 0,
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
      grade_filter: grade === Grade.all ? undefined : grade,
    },
    {
      skip: !isOpen,
    }
  );

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
      <Tabs onValueChange={(e) => setGrade(e)} className="">
        <TabsList className="bg-transparent grid grid-rows-2 grid-cols-2 gap-2 h-full ">
          {tabItems.map((tab) => (
            <TabsTrigger
              className="rounded-3xl bg-darkGray   uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white border-2 h-11 data-[state=active]:bg-mainColor"
              value={tab.tabValue}
            >
              <div className="flex truncate items-center gap-1">
                <p className="truncate text-xs">{tab.tabName}</p>
                <p className=" text-xs">({tab.tabReviewValue})</p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabItems.map((tab) => (
          <TabsContent value={tab.tabValue}>
            <ScrollArea className=" h-[70svh] w-full p-2">
              <div className="grid gap-2">
                {reviews?.content.map((review) => (
                  <ReviewCard ref={ref} key={review.id} review={review} />
                ))}
              </div>
              <ScrollBar className="" />
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
