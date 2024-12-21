import { CurrencyLang } from "@/entities/currency";
import { Lang } from "@/shared/config";
import { Card, CardContent } from "@/shared/ui";
import { useTranslation } from "react-i18next";
type CollapsedFormProps = {
  giveCurrency: CurrencyLang;
  getCurrency: CurrencyLang;
  onClick: () => void;
};
export const CollapsedForm = (props: CollapsedFormProps) => {
  const { getCurrency, giveCurrency, onClick } = props;

  const { t, i18n } = useTranslation();
  const giveCurrencyName =
    i18n.language === Lang.ru ? giveCurrency?.name.ru : giveCurrency?.name.en;
  const getCurrencyName =
    i18n.language === Lang.ru ? getCurrency?.name.ru : getCurrency?.name.en;
  return (
    <section
      onClick={onClick}
      className="bg-new-dark-grey  grid grid-cols-[1fr,1px,1fr]   gap-6 rounded-xl p-[14px]"
    >
      <div className="flex min-w-0 flex-1 gap-1 flex-col">
        <p className="text-white text-sm  font-semibold">{t("ОТДАЮ")}</p>
        <div className="flex items-center gap-[10px]">
          <img
            className="size-7"
            alt={`currency ${giveCurrencyName}`}
            src={giveCurrency?.icon_url}
          />
          <div className="flex flex-col min-w-0">
            <p className="text-[#B9B9B9] text-sm font-medium truncate">
              {giveCurrencyName}
            </p>
            <p className="text-new-secondary-text text-xs truncate ">
              {giveCurrency?.code_name}
            </p>
          </div>
        </div>
      </div>
      <hr className="w-px border-none h-full mx-auto bg-[#5F5F5F] " />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-white text-sm  font-semibold">{t("ПОЛУЧАЮ")}</p>
        <div className="flex items-center gap-[10px]">
          <img
            className="size-7"
            alt={`currency ${getCurrencyName}`}
            src={getCurrency?.icon_url}
          />
          <div className="flex flex-col min-w-0">
            <p className="text-[#B9B9B9] text-sm font-medium truncate">
              {getCurrencyName}
            </p>
            <p className="text-new-secondary-text text-xs truncate ">
              {getCurrency?.code_name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
