import { LogoArrow } from "@/shared/assets";
import { Button } from "@/shared/ui";
import { cx } from "class-variance-authority";
type CollapseButtonProps = {
  currentGiveCurrency: boolean;
  currentGetCurrencies: boolean;
  isCollapse: boolean;
  currenctExchangersIsSuccessState: boolean;
  onClick: () => void;
};
export const CollapseButton = (props: CollapseButtonProps) => {
  const {
    currentGiveCurrency,
    currentGetCurrencies,
    isCollapse,
    currenctExchangersIsSuccessState,
    onClick,
  } = props;

  return (
    <Button
      onClick={onClick}
      disabled={!currenctExchangersIsSuccessState}
      className={cx(
        "transition duration-1000 ease-in-out flex justify-center bottom-0 disabled:opacity-100  items-center absolute left-[50%] right-[50%] -translate-x-1/2 translate-y-3  h-7 rounded-full",
        currenctExchangersIsSuccessState
          ? "bg-mainColor border-2 border-darkGray "
          : "bg-lightGray",
        isCollapse ? "w-1/4" : "w-1/3"
      )}
    >
      <LogoArrow
        className={cx(
          "transition duration-300 size-6 ease-in-out",
          isCollapse ? "-rotate-90" : "rotate-90 "
        )}
      />
    </Button>
  );
};
