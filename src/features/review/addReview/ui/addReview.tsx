import { ExchangerMarker } from "@/entities/exchanger";
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
import { zodResolver } from "@hookform/resolvers/zod";

import { cx } from "class-variance-authority";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";

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
  const [addReview, { isSuccess, isLoading: addReviewLoading }] =
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
          }
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
          className="border-none w-full py-3 h-full rounded-[16px] mx-auto font-light truncate text-xs border-lightGray text-black text-center bg-mainColor uppercase"
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
        <DrawerContent className="border-none gap-10 grid-rows grid-cols-1 p-2">
          <DrawerHeader className="relative grid grid-flow-col justify-between items-center gap-3 h-11">
            <DrawerClose className="absolute left-2 top-5 grid gap-2 grid-flow-col items-center">
              <div className="rotate-90">
                <CloseDrawerIcon width={22} height={22} fill={"#fff"} />
              </div>
              <p className="text-[14px] uppercase text-white font-medium">
                {t("reviews.exit_add_review")}
              </p>
            </DrawerClose>
            <div className="absolute right-2 top-4">
              <LogoBig width={130} />
            </div>
          </DrawerHeader>
          <ScrollArea className="h-[calc(100svh_-_60px)] pt-[24px]">
            <Form {...reviewForm}>
              <form
                data-vaul-no-drag
                className={cx(
                  "flex mx-2 items-center gap-4 border-2 grid-cols-1 border-mainColor rounded-2xl p-4 min-h-[50svh]",
                  isSuccess && "bg-mainColor h-[calc(100svh_-_100px)]"
                )}
                onSubmit={reviewForm.handleSubmit(onSubmit)}
              >
                {isSuccess ? (
                  <p className="text-darkGray text-xl text-center font-bold uppercase w-[80%] mx-auto">
                    {t("reviews.add_review_success")}
                  </p>
                ) : (
                  <div className="grid gap-4">
                    <p className="text-mainColor text-center uppercase">
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
                              <TabsList className="grid h-auto max-[350px]:grid-rows-3 max-[350px]:grid-cols-1 grid-rows-2 grid-cols-2 gap-2  items-center bg-transparent ">
                                {tabItems.map((tab, index) => (
                                  <TabsTrigger
                                    key={index}
                                    className={cx(
                                      `text-white p-3 data-[state=active]:border-mainColor data-[state=active]:bg-mainColor bg-darkGray rounded-full h-full border-2 text-xs border-lightGray `,
                                      index === 0
                                        ? "col-span-2 max-[350px]:col-span-1 mx-auto max-[350px]:mx-0"
                                        : ""
                                    )}
                                    value={String(tab?.tabValue)}
                                  >
                                    <p className="text-[10px] uppercase">
                                      {tab?.tabName}
                                    </p>
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
                                  "rounded-2xl bg-darkGray text-white placeholder:text-lightGray placeholder:font-light focus:placeholder:opacity-0 text-[16px]",
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
                                  className="rounded-2xl text-[16px] bg-darkGray text-white placeholder:text-lightGray focus:placeholder:opacity-0 placeholder:font-light"
                                  placeholder={t(
                                    "reviews.transaction_placeholder"
                                  )}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <Button
                      className="rounded-full h-full py-6 bg-mainColor text-black uppercase"
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
        </DrawerContent>
      )}
    </Drawer>
  );
};
{
  /* <Tabs>
                        <TabsList className="grid grid-rows-2 ">
                          {tabItems.map((tab) => (
                            <TabsTrigger
                              className="w-full"
                              key={tab.tabValue}
                              value={tab.tabName}
                            >
                              {tab.tabName}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {tabItems.map((tab) => (
                          <TabsContent value={tab.tabName}>
                            
                          </TabsContent>
                        ))}
                      </Tabs> */
}
{
  /* <RadioGroup className="grid">
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              className="w-full h-10"
                              value="positive"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="negative" />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="neutral" />
                          </FormControl>
                        </FormItem>
                      </RadioGroup> */
}
{
  /* <Tabs
onValueChange={(e) => {
  field.onChange(e);
}}
>
<TabsList className="grid ">
  <TabsTrigger
    className="rounded-full border-2"
    value="1"
  >
    {t("ПОЛОЖИТЕЛЬНЫЙ")}
  </TabsTrigger>
  <TabsTrigger
    className="rounded-full border-2"
    value="0"
  >
    {t("НЕЙТРАЛЬНЫЙ")}
  </TabsTrigger>
  <TabsTrigger
    className="rounded-full border-2"
    value="-1"
  >
    {t("ОТРИЦАТЕЛЬНЫЙ")}
  </TabsTrigger>
</TabsList>
</Tabs> */
}
