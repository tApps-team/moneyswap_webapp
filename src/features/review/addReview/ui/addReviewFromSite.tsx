import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Grade,
  useAddReviewByExchangeMutation,
  useCheckUserReviewPermissionQuery,
} from "@/entities/review";
import { useAppSelector } from "@/shared/hooks";
import { ExchangerMarker } from "@/shared/types";
import { paths } from "@/shared/routing";
import { CloseDrawerIcon, LogoBig } from "@/shared/assets";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
} from "@/shared/ui";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";

interface AddReviewFromSiteProps {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
}

export const AddReviewFromSite = (props: AddReviewFromSiteProps) => {
  const { exchange_id, exchange_marker } = props;
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, user_id } = useAppSelector((state) => state.user);
  const tg_id = user ? user?.id : user_id;

  const reviewForm = useForm<AddReviewSchemaType>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      review: "",
      grade: "1",
    },
  });

  const [addReview, { isSuccess, isLoading: addReviewLoading }] =
    useAddReviewByExchangeMutation();

  const onSubmit = (review: AddReviewSchemaType) => {
    if (tg_id && checkUserPermissionIsSuccess) {
      addReview({
        exchange_id: exchange_id,
        exchange_marker: exchange_marker,
        grade: (review?.grade as Grade) || 1,
        text: review?.review,
        tg_id: tg_id,
        transaction_id: review?.grade === "-1" ? review?.transaction_id : null,
      })
        .unwrap()
        .catch((error) => {
          if (error?.status === 423) {
            toast({
              title: t("reviews.permission_error"),
            });
          } else if (error?.status === 404) {
              toast({
                title: t("reviews.error_404"),
                variant: "destructive",
              });
          } else {
            toast({
              title: t("reviews.error"),
            });
          }
        });
    } else {
      toast({
        title: t("reviews.error"),
      });
    }
  };

  reviewForm.watch(["grade", "transaction_id", "review"]);
  

  const { isLoading: checkUserPermissionIsLoading, isFetching: checkUserPermissionIsFetching, isError: checkUserReviewPermissionIsError, isSuccess: checkUserPermissionIsSuccess} = useCheckUserReviewPermissionQuery({
    exchange_id,
    exchange_marker,
    tg_id: tg_id || -1,
  }, {skip: !tg_id});

  useEffect(() => {
    if (checkUserReviewPermissionIsError) {
      toast({
        title: t("reviews.permission_error"),
      });
    }
  }, [checkUserReviewPermissionIsError, toast]);

  const tabItems: {
    tabValue: Grade;
    tabName: string;
  }[] = [
    {
      tabValue: Grade.positive,
      tabName: t("reviews.grade.positive"),
    },
    {
      tabValue: Grade.neutral,
      tabName: t("reviews.grade.neutral"),
    },
    {
      tabValue: Grade.negative,
      tabName: t("reviews.grade.negative"),
    },
  ];

  if (checkUserPermissionIsLoading || checkUserPermissionIsFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-12 text-mainColor" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-xl z-50 p-2">
      <div className="relative h-full">
        <Link to={paths.main} onClick={() => window.scrollTo(0, 0)} className="z-50 absolute left-2 top-5 grid gap-2 grid-flow-col items-center cursor-pointer">
          <div className="rotate-90">
            <CloseDrawerIcon width={22} height={22} fill={"#fff"} />
          </div>
          <p className="text-[14px] uppercase text-white font-semibold">
            {t("reviews.exit_add_review")}
          </p>
        </Link>
        
        <ScrollArea className="h-[calc(100svh_-_60px)] pt-6">
          <div className="flex justify-center items-center py-8">
            <LogoBig width={200} />
          </div>
          <Form {...reviewForm}>
            <form
              className={cx(
                "flex mx-2 items-center gap-4 grid-cols-1 rounded-[10px] px-4 py-8 min-h-[40dvh] bg-new-dark-grey",
                isSuccess && "bg-mainColor h-[calc(100dvh_-_200px)] max-h-[500px]"
              )}
              onSubmit={reviewForm.handleSubmit(onSubmit)}
            >
              {isSuccess ? (
                <p className="text-mainColor text-xl text-center font-semibold uppercase w-[80%] mx-auto">
                  {t("reviews.add_review_success")}
                </p>
              ) : (
                <div className="grid gap-4">
                  <p className="text-mainColor text-center uppercase font-semibold text-[15px] w-[90%] mx-auto">
                    {t("reviews.add_review_title")}
                  </p>
                  <FormField
                    control={reviewForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Tabs
                            defaultValue={"1"}
                            className=""
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                          >
                            <TabsList className="p-0 grid h-auto max-[350px]:grid-rows-3 max-[350px]:grid-cols-1 grid-rows-2 grid-cols-2 gap-2 items-center bg-transparent">
                              {tabItems.map((tab, index) => (
                                <TabsTrigger
                                  key={index}
                                  className={cx(
                                    `text-white px-10 py-2 data-[state=active]:border-mainColor data-[state=active]:bg-mainColor bg-new-tabs-grey rounded-[7px] h-full text-xs`,
                                    index === 0
                                      ? "col-span-2 max-[350px]:col-span-1 mx-auto max-[350px]:mx-0"
                                      : ""
                                  )}
                                  value={String(tab?.tabValue)}
                                >
                                  <p className="font-semibold">{tab?.tabName}</p>
                                </TabsTrigger>
                              ))}
                            </TabsList>
                          </Tabs>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div>
                  {reviewForm.getValues("grade") === "-1" && (
                    <FormField
                        control={reviewForm.control}
                        name="transaction_id"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel></FormLabel>
                            <FormControl>
                              <Input
                                className="border-none rounded-[10px] text-[16px] bg-new-light-grey text-white placeholder:text-lightGray focus:placeholder:opacity-0 placeholder:font-light"
                                placeholder={t("reviews.transaction_placeholder")}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={reviewForm.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel></FormLabel>
                          <FormControl>
                            <Textarea
                              className={cx(
                                "border-none rounded-[10px] bg-new-light-grey text-white placeholder:text-lightGray placeholder:font-light focus:placeholder:opacity-0 text-[16px]",
                                reviewForm.getValues("grade") === "-1"
                                  ? "h-24"
                                  : "h-36"
                              )}
                              placeholder={t("reviews.review_placeholder")}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="rounded-[10px] h-auto py-4 bg-mainColor text-black font-semibold"
                    type="submit"
                    disabled={addReviewLoading}
                  >
                    {addReviewLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      t("reviews.send_review")
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
