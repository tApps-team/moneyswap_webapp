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
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";
import { cx } from "class-variance-authority";
import { Loader } from "lucide-react";
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
      transaction_id: "",
    },
  });
  const [addReview, { isSuccess, isLoading: addReviewLoading }] =
    useAddReviewByExchangeMutation();
  const onSubmit = (review: AddReviewSchemaType) => {
    console.log(review);
    addReview({
      exchange_id: exchange_id,
      exchange_marker: exchange_marker,
      grade: reviewForm.getValues("grade") as Grade,
      text: review.review,
      tg_id: 686339126,
      transaction_id: reviewForm.getValues("transaction_id") || null,
    });
  };
  reviewForm.watch("grade");
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
        title: "Ошибка",
      });
    }
  }, [checkUserReviewPermissionIsError, toast]);
  const tabItems: {
    tabValue: Grade;
    tabName: string;
  }[] = [
    {
      tabValue: Grade.positive,
      tabName: t("ПОЛОЖИТЕЛЬНЫЕ"),
    },
    {
      tabValue: Grade.neutral,
      tabName: t("НЕЙТРАЛЬНЫЕ"),
    },
    {
      tabValue: Grade.negative,
      tabName: t("ОТРИЦАТЕЛЬНЫЕ"),
    },
  ];

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          className="border-2 rounded-2xl w-full truncate text-xs border-lightGray text-white text-center bg-darkGray"
          onClick={handleClick}
        >
          {t("ДОБАВИТЬ ОТЗЫВ ОБ ОБМЕННИКЕ")}
        </Button>
      </DrawerTrigger>
      {checkUserPermissionIsSuccess && (
        <DrawerContent className="h-svh border-none gap-10 grid grid-rows-[_0.3fr,_1fr,_0.3fr] grid-cols-1   p-2 ">
          <DrawerHeader className="px-0 gap-10 ">
            <DrawerClose asChild>
              <div className="flex justify-start items-center gap-2">
                <CloseDrawerIcon
                  className="rotate-90 fill-white"
                  color={"#fff"}
                  width={26}
                  height={26}
                />
                <p className="text-white">{t("ВЫЙТИ")}</p>
              </div>
            </DrawerClose>

            <LogoBig className="h-14 w-80 mx-auto" />
          </DrawerHeader>
          <Form {...reviewForm}>
            <form
              className={cx(
                "grid items-center gap-4 border-2   grid-cols-1 border-mainColor rounded-2xl p-4 ",
                isSuccess && "bg-mainColor "
              )}
              onSubmit={reviewForm.handleSubmit(onSubmit)}
            >
              {isSuccess ? (
                <p className="text-darkGray text-xl text-center font-bold ">
                  {t("ВАШ ОТЗЫВ УСПЕШНО ДОБАВЛЕН")}
                </p>
              ) : (
                <div className="grid gap-4">
                  <p className="text-mainColor text-center ">
                    {t("ПОЖАЛУЙСТА, ОСТАВЬТЕ СВОЙ ОТЗЫВ О НАШЕМ ОБМЕННИКЕ")}
                  </p>
                  <FormField
                    control={reviewForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Tabs
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
                                    `text-white  data-[state=active]:border-mainColor data-[state=active]:bg-mainColor bg-darkGray rounded-full h-12 border-2 text-xs`,
                                    index === 0
                                      ? "col-span-2 max-[350px]:col-span-1 mx-auto max-[350px]:mx-0"
                                      : ""
                                  )}
                                  value={String(tab.tabValue)}
                                >
                                  {tab.tabName}
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
                                "rounded-2xl bg-darkGray text-white placeholder:text-lightGray",
                                reviewForm.getValues("grade") === "-1"
                                  ? "h-24"
                                  : "h-36"
                              )}
                              placeholder={t("Введите отзыв...")}
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
                                className="rounded-2xl bg-darkGray text-white placeholder:text-lightGray"
                                placeholder={t("Введите номер транзакции...")}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button
                    className="rounded-full h-[70px] bg-mainColor text-black "
                    type="submit"
                  >
                    {addReviewLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      t("ОТПРАВИТЬ ОТЗЫВ")
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
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
