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
  const [addReview, { isSuccess }] = useAddReviewByExchangeMutation();
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
  // const gradeItems: {
  //   tabValue: Grade;
  //   tabName: string;
  // }[] = [
  //   {
  //     tabValue: Grade.positive,
  //     tabName: t("ПОЛОЖИТЕЛЬНЫЕ"),
  //   },
  //   {
  //     tabValue: Grade.neutral,
  //     tabName: t("НЕЙТРАЛЬНЫЕ"),
  //   },
  //   {
  //     tabValue: Grade.negative,
  //     tabName: t("ОТРИЦАТЕЛЬНЫЕ"),
  //   },
  // ];

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
        <DrawerContent className="h-svh grid grid-rows-[1fr_1fr_1fr] grid-cols-1 gap-4    p-2 ">
          <DrawerHeader className="px-0 ">
            <DrawerClose asChild>
              <Button variant={"default"} className="flex justify-start gap-2">
                <CloseDrawerIcon
                  className="rotate-90 fill-white"
                  color={"#fff"}
                  width={26}
                  height={26}
                />
                <p>{t("ВЫЙТИ")}</p>
              </Button>
            </DrawerClose>
            <div className="flex items-center ">
              <LogoBig className="h-14 w-96" />
            </div>
          </DrawerHeader>
          <Form {...reviewForm}>
            <form
              className="grid items-center gap-4 border-2  grid-cols-1 border-mainColor rounded-2xl p-4"
              onSubmit={reviewForm.handleSubmit(onSubmit)}
            >
              {isSuccess ? (
                <p className="text-mainColor text-center">
                  {t("ВАШ ОТЗЫВ УСПЕШНО ДОБАВЛЕН")}
                </p>
              ) : (
                <>
                  <p className="text-mainColor text-center">
                    {t("ПОЖАЛУЙСТА, ОСТАВЬТЕ СВОЙ ОТЗЫВ О НАШЕМ ОБМЕННИКЕ")}
                  </p>
                  <FormField
                    control={reviewForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Tabs
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                          >
                            <TabsList className="grid h-auto  grid-rows-2 grid-cols-[1fr,0.5fr] gap-3 items-center bg-transparent ">
                              <TabsTrigger
                                className="rounded-full col-span-2 mx-auto text-xs  border-2  "
                                value="1"
                              >
                                {t("ПОЛОЖИТЕЛЬНЫЙ")}
                              </TabsTrigger>

                              <TabsTrigger
                                className="rounded-full border-2 text-xs "
                                value="0"
                              >
                                {t("НЕЙТРАЛЬНЫЙ")}
                              </TabsTrigger>
                              <TabsTrigger
                                className="rounded-full border-2 text-xs "
                                value="-1"
                              >
                                {t("ОТРИЦАТЕЛЬНЫЙ")}
                              </TabsTrigger>
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
                              className="rounded-2xl"
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
                              <Textarea
                                className="rounded-2xl w-full"
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
                    {t("ОТПРАВИТЬ ОТЗЫВ")}
                  </Button>
                </>
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
