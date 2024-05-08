import { Card, CardContent } from "@/shared/ui";
import { Currency } from "../model/types/currency";

type CurrencyCardProps = {
  currency: Currency;
  onClick?: () => void;
};
export const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, onClick } = props;
  return (
    <Card onClick={onClick}>
      <CardContent className="grid grid-cols-2 grid-rows-2">
        <img
          className="col-span-2"
          src={currency.icon_url}
          alt={`Валюта ${currency.name}`}
          width={26}
          height={26}
        />
        <div>{currency.name}</div>
        <div>{currency.code_name}</div>
      </CardContent>
    </Card>
  );
};
