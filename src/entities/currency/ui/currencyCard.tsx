import { Card, CardContent } from "@/shared/ui";
import { Currency } from "../model/types/currency";
import { cx } from "class-variance-authority";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
  active?: boolean;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick, active } = props;
  return (
    <Card
      className={cx(
        "h-[70px] rounded-full border-2 bg-darkGray text-white border-lightGray",
        active && "bg-mainColor border-mainColor text-black"
      )}
      onClick={onClick}
    >
      <CardContent className="grid h-full grid-flow-col px-4 py-2 justify-start gap-3 gap-y-0 items-center">
        <img
          className="row-span-2"
          src={currency.icon_url}
          alt={`Валюта ${currency.name}`}
          width={36}
          height={36}
        />
        <div className="truncate font-bold uppercase">{currency.name}</div>
        <div className="truncate uppercase">{currency.code_name}</div>
      </CardContent>
    </Card>
  );
};
