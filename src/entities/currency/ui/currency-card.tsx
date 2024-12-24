import { Card, CardContent } from "@/shared/ui";
import { Currency } from "../model/types/currency";
import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";
import { cn } from "@/shared/lib/utils";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
  active?: boolean;
  isPopular?: boolean;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick, active } = props;

  const { t, i18n } = useTranslation();

  const currencyName =
    i18n.language === Lang.ru ? currency.name.ru : currency.name.en;

  return (
    <Card
      className={cx(
        "h-auto relative rounded-none shadow-none border-0 bg-transparent text-white min-w-0 cursor-pointer",
        active && "bg-mainColor text-black"
      )}
      onClick={onClick}
    >
      {currency.is_popular && (
        <span
          className={cn(
            "absolute right-2  -translate-y-3 text-[10px] rounded-[3px] bg-mainColor text-black text-center py-[2px] px-2 font-medium",
            active && "border border-mainColor bg-new-dark-grey text-mainColor"
          )}
        >
          {t("Popular")}
        </span>
      )}
      <CardContent className="grid h-full grid-cols-[auto_1fr] px-5 py-2 justify-start gap-5 gap-y-0 items-center leading-none">
        <img
          src={currency.icon_url}
          alt={`Валюта ${currency.name}`}
          width={32}
          height={32}
          className="rounded-full size-8 object-cover"
        />
        <div className="flex flex-col min-w-0 items-start gap-0">
          <p className="font_unbounded text-sm line-clamp-1 text-start font-semibold uppercase">
            {currencyName}
          </p>
          <p className="text-sm uppercase text-[#6F6F6F]">
            {currency.code_name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
