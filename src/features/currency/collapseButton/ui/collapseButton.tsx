import { LogoArrow } from "@/shared/assets";
import { Button } from "@/shared/ui";
import { cx } from "class-variance-authority";
type CollapseButtonProps = {
  currentGiveCurrency: boolean;
  currentGetCurrencies: boolean;
  currenctExchangersIsSuccessState: boolean;
  onClick: () => void;
};
export const CollapseButton = (props: CollapseButtonProps) => {
  const {
    currentGiveCurrency,
    currentGetCurrencies,
    currenctExchangersIsSuccessState,
    onClick,
  } = props;
  return (
    <Button
      onClick={onClick}
      disabled={!currenctExchangersIsSuccessState}
      className={cx(
        "w-1/3  flex justify-center bottom-0 disabled:opacity-100  items-center absolute left-[50%] right-[50%] -translate-x-1/2 translate-y-3  h-6 rounded-full",
        !currentGiveCurrency || !currentGetCurrencies
          ? "bg-lightGray"
          : "bg-mainColor border-2 border-darkGray "
      )}
    >
      <LogoArrow
        className={cx(
          "transition duration-300 size-6 ease-in-out",
          currenctExchangersIsSuccessState ? "rotate-90" : "-rotate-90 "
        )}
      />
    </Button>
  );
};
