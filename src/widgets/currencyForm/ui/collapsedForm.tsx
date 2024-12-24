import { Currency } from "@/entities/currency";
import { Lang } from "@/shared/config";
import { useTranslation } from "react-i18next";
type CollapsedFormProps = {
  giveCurrency: Currency;
  getCurrency: Currency;
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
      className="bg-new-dark-grey  grid grid-cols-[1fr,1px,1fr] gap-4 rounded-xl p-[14px] pb-4"
    >
      <div className="flex min-w-0 flex-1 gap-1 flex-col">
        <p className="font_unbounded text-white text-sm font-semibold">
          {t("ОТДАЮ")}
        </p>
        <div className="flex items-center gap-[10px]">
          <img
            className="size-7"
            alt={`currency ${giveCurrencyName}`}
            src={giveCurrency?.icon_url}
          />
          <div className="flex flex-col min-w-0">
            <p className="text-[#B9B9B9] text-[13px] font-medium truncate uppercase">
              {giveCurrencyName}
            </p>
            <p className="text-new-secondary-text text-xs truncate ">
              {giveCurrency?.code_name}
            </p>
          </div>
        </div>
      </div>
      <hr className="w-px border-none h-[80%] my-auto mx-auto bg-[#5F5F5F]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font_unbounded text-white text-sm font-semibold">
          {t("ПОЛУЧАЮ")}
        </p>
        <div className="flex items-center gap-[10px]">
          <img
            className="size-7"
            alt={`currency ${getCurrencyName}`}
            src={getCurrency?.icon_url}
          />
          <div className="flex flex-col min-w-0">
            <p className="text-[#B9B9B9] text-[13px] font-medium truncate uppercase">
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
