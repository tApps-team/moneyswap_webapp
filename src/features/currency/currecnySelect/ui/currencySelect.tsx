import { Currency } from "@/entities/currency";
import { Button, Drawer, DrawerTrigger } from "@/shared/ui";

type CurrecnySelectProps = {
  disabled: boolean;
  currencies: Currency[];
};
export const CurrencySelect = (props: CurrecnySelectProps) => {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button></Button>
      </DrawerTrigger>
    </Drawer>
  );
};
