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
  tg_id: number;
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
    console.log(review);
    addReview({
      exchange_id: exchange_id,
      exchange_marker: exchange_marker,
      grade: (review.grade as Grade) || 1,
      text: review.review,
      tg_id: 686339126,
      transaction_id: review.grade === "-1" ? review.transaction_id : null,
    });
  };
  reviewForm.watch(["grade", "transaction_id", "review"]);
  const [
    checkUserReviewPermission,
    {
      data,
      isError: checkUserReviewPermissionIsError,
      isLoading,
      isSuccess: checkUserPermissionIsSuccess,
    },
  ] = useLazyCheckUserReviewPermissionQuery();
  const handleClick = () => {
    checkUserReviewPermission({
      exchange_id,
      exchange_marker,
      tg_id: 686339127,
    });
  };
  useEffect(() => {
    if (checkUserReviewPermissionIsError) {
      toast({
        title: "Вы уже отставляли коментарий на этот обменник",
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
          className="border-none w-[90%] py-3 h-full rounded-[16px] mx-auto font-light truncate text-xs border-lightGray text-black text-center bg-mainColor uppercase"
          onClick={handleClick}
        >
          {t("reviews.add_review_btn")}
        </Button>
      </DrawerTrigger>
      {checkUserPermissionIsSuccess && (
        <DrawerContent className="min-h-svh max-h-svh border-none gap-10 grid-rows  grid-cols-1   p-2 ">
          <ScrollArea className="overflow-y-auto">
            <DrawerHeader className="px-0 gap-10 ">
              <DrawerClose asChild>
                <div className="flex justify-start items-center gap-2">
                  <CloseDrawerIcon
                    className="rotate-90 fill-white"
                    color={"#fff"}
                    width={22}
                    height={22}
                  />
                  <p className="text-[14px] font-medium text-white uppercase">
                    {t("reviews.exit_add_review")}
                  </p>
                </div>
              </DrawerClose>
              <LogoBig className="h-full my-2 w-[60%] mx-auto" />
            </DrawerHeader>
            <Form {...reviewForm}>
              <form
                data-vaul-no-drag
                className={cx(
                  "grid items-center gap-4 border-2 grid-cols-1 border-mainColor rounded-2xl p-4 ",
                  isSuccess && "bg-mainColor "
                )}
                onSubmit={reviewForm.handleSubmit(onSubmit)}
              >
                {isSuccess ? (
                  <p className="text-darkGray text-xl text-center font-bold uppercase">
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
                                  "rounded-2xl bg-darkGray text-white placeholder:text-lightGray placeholder:font-light",
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
                                  className="rounded-2xl bg-darkGray text-white placeholder:text-lightGray placeholder:font-light"
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
