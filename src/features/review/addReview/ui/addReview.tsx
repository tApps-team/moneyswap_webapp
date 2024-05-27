import { ExchangerMarker } from "@/entities/exchanger";
import {
  Grade,
  useAddReviewByExchangeMutation,
  useLazyCheckUserReviewPermissionQuery,
} from "@/entities/review";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@/shared/ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AddReviewSchemaType, addReviewSchema } from "../model/addReviewSchema";
import { zodResolver } from "@hookform/resolvers/zod";
type AddReviewProps = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  tg_id: number;
};
export const AddReview = (props: AddReviewProps) => {
  const { exchange_id, exchange_marker, tg_id } = props;
  const { t } = useTranslation();
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
  const [checkUserReviewPermission, { data, isError, isLoading, isSuccess }] =
    useLazyCheckUserReviewPermissionQuery();
  const handleClick = () => {
    checkUserReviewPermission({
      exchange_id,
      exchange_marker,
      tg_id: 686339127,
    });
  };
  console.log(data);
  return (
    <>
      {/* {data?.status === "success" ? ( */}
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button
            className="border-2 rounded-2xl border-lightGray text-white text-center bg-darkGray"
            onClick={handleClick}
          >
            {t("ДОБАВИТЬ ОТЗЫВ ОБ ОБМЕННИКЕ")}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-svh">
          <DrawerHeader>
            <DrawerClose>ВЫЙТИ</DrawerClose>
          </DrawerHeader>
          <Form {...reviewForm}>
            <form onSubmit={reviewForm.handleSubmit(onSubmit)}>
              <FormField
                control={reviewForm.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ОСТАВИТЬ ОТЗЫВ")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Введите отзыв...")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{t("ОТПРАВИТЬ ОТЗЫВ")}</Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
      {/* ) : (
        <div>Ошибка</div>
      )} */}
    </>
  );
};
