import { Card, CardContent } from "@/shared/ui";
import { Currency } from "../model/types/currency";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick } = props;
  return (
    <Card className="h-[70px] rounded-full border-2  " onClick={onClick}>
      <CardContent className="grid h-full   grid-flow-col px-4 py-2 justify-start  gap-3 items-center">
        <img
          className="row-span-2"
          src={currency.icon_url}
          alt={`Валюта ${currency.name}`}
          width={34}
          height={34}
        />
        <div className="truncate">{currency.name}</div>
        <div className="truncate">{currency.code_name}</div>
      </CardContent>
    </Card>
  );
};
