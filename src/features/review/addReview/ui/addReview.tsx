import { ExchangerMarker } from "@/entities/exchanger";
import {
  Grade,
  useAddReviewByExchangeMutation,
  useLazyCheckUserReviewPermissionQuery,
} from "@/entities/review";
import {
  Button,
  Card,
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
  RadioGroup,
  useToast,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";
import { useEffect } from "react";
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
    },
  });
  const [addReview, {}] = useAddReviewByExchangeMutation();
  const onSubmit = (review: AddReviewSchemaType) => {
    console.log(review);
    addReview({
      exchange_id: exchange_id,
      exchange_marker: exchange_marker,
      grade: Grade.negative,
      text: review.review,
      tg_id: 686339126,
      transaction_id: "123123123123",
    });
  };
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
  console.log(data);
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          className="border-none w-[90%] py-3 h-full rounded-[16px] mx-auto font-light truncate text-xs border-lightGray text-black text-center bg-mainColor"
          onClick={handleClick}
        >
          {t("ДОБАВИТЬ ОТЗЫВ ОБ ОБМЕННИКЕ")}
        </Button>
      </DrawerTrigger>
      {checkUserPermissionIsSuccess && (
        <DrawerContent className="h-svh border-none">
          <DrawerHeader>
            <DrawerClose>ВЫЙТИ</DrawerClose>
          </DrawerHeader>

          <Form {...reviewForm}>
            <form
              className="border-2 border-mainColor grid "
              onSubmit={reviewForm.handleSubmit(onSubmit)}
            >
              {t("ПОЖАЛУЙСТА, ОСТАВЬТЕ СВОЙ ОТЗЫВ О НАШЕМ ОБМЕННИКЕ")}
              {/* <FormField
                control={reviewForm.control}
                name="grade"
                render={({ field }) => {
                  <FormItem>
                    <FormControl>
                      <RadioGroup>
                        
                      </RadioGroup>
                    </FormControl>
                  </FormItem>;
                }}
              /> */}
              <FormField
                control={reviewForm.control}
                name="review"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input
                        className="h-32"
                        placeholder={t("Введите отзыв...")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{t("ОТПРАВИТЬ ОТЗЫВ")}</Button>
            </form>
          </Form>
        </DrawerContent>
      )}
    </Drawer>
  );
};
