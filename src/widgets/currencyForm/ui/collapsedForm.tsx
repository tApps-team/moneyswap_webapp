import { CurrencyLang } from "@/entities/currency";
import { Lang } from "@/shared/config";
import { Card, CardContent } from "@/shared/ui";
import { useTranslation } from "react-i18next";
type CollapsedFormProps = {
  giveCurrency: CurrencyLang;
  getCurrency: CurrencyLang;
};
export const CollapsedForm = (props: CollapsedFormProps) => {
  const { getCurrency, giveCurrency } = props;
  const { t, i18n } = useTranslation();
  const giveCurrencyName =
    i18n.language === Lang.ru ? giveCurrency?.name.ru : giveCurrency?.name.en;
  const getCurrencyName =
    i18n.language === Lang.ru ? getCurrency?.name.ru : getCurrency?.name.en;
  return (
    <Card className="h-[70px] border-mainColor  rounded-full bg-mainColor text-black">
      <CardContent className="grid grid-cols-2  px-4 py-2 h-full w-full gap-4">
        <div className="flex items-center  gap-2">
          <div className="truncate">
            <div className="font-bold">{t("ОТДАЮ")}</div>
            <div className="flex gap-1">
              <div className="truncate text-xs uppercase">
                {giveCurrencyName}
              </div>
              <div className="truncate text-xs uppercase">
                {giveCurrency?.code_name}
              </div>
            </div>
          </div>
          <img
            className="size-8"
            src={giveCurrency?.icon_url}
            alt={`${"Валюта"} ${giveCurrencyName}}`}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="truncate">
            <div className="font-bold">{t("ПОЛУЧАЮ")}</div>
            <div className="flex gap-1">
              <div className="truncate text-xs uppercase">
                {getCurrencyName}
              </div>
              <div className="truncate text-xs uppercase">
                {getCurrency?.code_name}
              </div>
            </div>
          </div>
          <img
            className="size-8"
            src={getCurrency?.icon_url}
            alt={`${"Валюта"} ${getCurrency?.name}}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
