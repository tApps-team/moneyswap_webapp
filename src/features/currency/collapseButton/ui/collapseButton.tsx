import { LogoArrow } from "@/shared/assets";
import { Button } from "@/shared/ui";
import { cx } from "class-variance-authority";
type CollapseButtonProps = {
  currentGiveCurrency: boolean;
  currentGetCurrencies: boolean;
  currenctExchangersIsSuccessState: boolean;
};
export const CollapseButton = (props: CollapseButtonProps) => {
  const {
    currentGiveCurrency,
    currentGetCurrencies,
    currenctExchangersIsSuccessState,
  } = props;
  return (
    <Button
      className={cx(
        "w-1/3  flex justify-center bottom-0  items-center absolute left-[50%] right-[50%] -translate-x-1/2 translate-y-3  h-6 rounded-full",
        !currentGiveCurrency || !currentGetCurrencies
          ? "bg-lightGray"
          : "bg-mainColor"
      )}
    >
      <LogoArrow
        className={cx(
          "transition duration-300 ease-in-out",
          currenctExchangersIsSuccessState ? "rotate-90" : "-rotate-90 "
        )}
      />
    </Button>
  );
};
