import { LogoIcon } from "@/shared/assets";
import { Button } from "@/shared/ui";

export const CurrencySwitcher = () => {
  return (
    <Button
      className="rounded-full h-20 w-20 bg-[#F6FF5F] "
      variant={"outline"}
    >
      <LogoIcon className="w-12 h-12" fill="black" />
    </Button>
  );
};
