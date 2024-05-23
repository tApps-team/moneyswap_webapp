import { ExchangerMarker } from "@/entities/exchanger";
import { useLazyCheckUserReviewPermissionQuery } from "@/entities/review";
import { Button } from "@/shared/ui";
import { useTranslation } from "react-i18next";
type AddReviewButtonProps = {
  exchange_id: number;
  exchange_marker: ExchangerMarker;
  tg_id: number;
};
export const AddReviewButton = (props: AddReviewButtonProps) => {
  const { exchange_id, exchange_marker, tg_id } = props;
  const { t } = useTranslation();
  const [checkUserReviewPermission, { data, isError, isLoading, isSuccess }] =
    useLazyCheckUserReviewPermissionQuery();
  const handleClick = () => {
    checkUserReviewPermission({ exchange_id, exchange_marker, tg_id });
  };
  return (
    <Button onClick={handleClick}>{t("ДОБАВИТЬ ОТЗЫВ ОБ ОБМЕННИКЕ")}</Button>
  );
};
