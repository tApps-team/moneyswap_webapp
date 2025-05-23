import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import {
  Grade,
  useAddReviewByExchangeMutation,
  useLazyCheckUserReviewPermissionQuery,
} from "@/entities/review";
import { CloseDrawerIcon, LogoBig } from "@/shared/assets";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
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
import { ExchangerMarker } from "@/shared/types";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { UserNotFound } from "./userNotFound";

type AddReviewProps = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  tg_id: number | null;
};
export const AddReview = (props: AddReviewProps) => {
  const { exchange_id, exchange_marker, tg_id } = props;
  const { t } = useTranslation();
  const { toast } = useToast();
  const reviewForm = useForm<AddReviewSchemaType>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      review: "",
      grade: "1",
    },
  });
  const [addReview, { isSuccess, isLoading: addReviewLoading, isError: addReviewIsError, error: AddReviewError }] =
    useAddReviewByExchangeMutation();

  const onSubmit = (review: AddReviewSchemaType) => {
    if (tg_id) {
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
          } else if (error?.status !== 404) {
            toast({
              title: t("reviews.error"),
            });
          }
        });
    } else {
      toast({
        title: t("reviews.permission_error"),
      });
    }
  };
  reviewForm.watch(["grade", "transaction_id", "review"]);
  const [
    checkUserReviewPermission,
    {
      isError: checkUserReviewPermissionIsError,
      isSuccess: checkUserPermissionIsSuccess,
      isLoading: checkUserPermissionIsLoading,
    },
  ] = useLazyCheckUserReviewPermissionQuery();
  const handleClick = () => {
    if (tg_id) {
      checkUserReviewPermission({
        exchange_id,
        exchange_marker,
        tg_id: tg_id,
      });
    } else {
      alert("tg_id is null...");
    }
  };
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

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          className="border-none w-full py-3 h-full rounded-[10px] mx-auto truncate text-xs text-black text-center bg-mainColor font-medium"
          onClick={handleClick}
        >
          {checkUserPermissionIsLoading ? (
            <Loader className="animate-spin h-4" />
          ) : (
            t("reviews.add_review_btn")
          )}
        </Button>
      </DrawerTrigger>
      {checkUserPermissionIsSuccess && (
        <DrawerContent className="border-none gap-10 grid-rows grid-cols-1 p-2 backdrop-blur-xl bg-black/50">
          {addReviewIsError && 'status' in (AddReviewError as FetchBaseQueryError) && (AddReviewError as FetchBaseQueryError).status === 404 ? (
            <UserNotFound exchanger_marker={exchange_marker} exchanger_id={exchange_id} />
          ) : (
            <>
              <DrawerHeader className="relative grid grid-flow-col justify-between items-center gap-3 h-11">
                <DrawerClose className="absolute left-2 top-5 grid gap-2 grid-flow-col items-center">
                  <div className="rotate-90">
                    <CloseDrawerIcon width={22} height={22} fill={"#fff"} />
                  </div>
                  <p className="text-[14px] uppercase text-white font-semibold">
                    {t("reviews.exit_add_review")}
                  </p>
                </DrawerClose>
              </DrawerHeader>
              <ScrollArea className="h-[calc(100svh_-_60px)] pt-6">
                <div className="flex justify-center items-center pb-8">
                  <LogoBig width={200} />
                </div>
                <Form {...reviewForm}>
                  <form
                    data-vaul-no-drag
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
            </>
          )}
        </DrawerContent>
      )}
    </Drawer>
  );
};
