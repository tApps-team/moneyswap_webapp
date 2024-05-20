import { Currency } from "@/entities/currency";
import { Card } from "@/shared/ui";
type CollapsedFormProps = {
  giveCurrency: Omit<Currency, "id">;
  getCurrency: Omit<Currency, "id">;
};
export const CollapsedForm = (props: CollapsedFormProps) => {
  const {} = props;
  return <Card></Card>;
};
