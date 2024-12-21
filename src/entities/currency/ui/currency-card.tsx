import { Card, CardContent } from "@/shared/ui";
import { Currency } from "../model/types/currency";
import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
  active?: boolean;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick, active } = props;

  const { t, i18n } = useTranslation();

  const currencyName =
    i18n.language === Lang.ru ? currency.name.ru : currency.name.en;

  return (
    <Card
      className={cx(
        "h-14  border-0 bg-transparent text-white   cursor-pointer",
        active && "bg-mainColor text-black"
      )}
      onClick={onClick}
    >
      <CardContent className="grid h-full grid-cols-[auto_1fr] px-4 py-2 justify-start gap-3 gap-y-0 items-center leading-none">
        <img
          src={currency.icon_url}
          alt={`Валюта ${currency.name}`}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col items-start gap-1">
          <p className="truncate font-semibold uppercase">{currencyName}</p>
          <p className="truncate uppercase text-[#6F6F6F]">
            {currency.code_name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
