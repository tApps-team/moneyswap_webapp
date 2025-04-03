import { useState } from "react";
import { AMLMobileIcon } from "@/shared/assets";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export const AMLTooltip = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    return (
      <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          type="button"
          className="!z-[15]"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
            e.preventDefault();
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <AMLMobileIcon />
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="shadow-lg !z-[20] bg-new-light-grey rounded-[8px] lg:px-4 lg:py-3 px-2 py-2 border-none w-[70vw] max-w-[200px]"
        >
          <p className="leading-3 mobile-xl:text-xs text-[10px] text-white text-wrap">{t("AML")}</p>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
    );
  };