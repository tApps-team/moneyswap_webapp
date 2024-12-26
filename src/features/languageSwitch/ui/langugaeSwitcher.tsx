import { Lang } from "@/shared/config";
import { Label, Switch } from "@/shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggle = useCallback(async () => {
    i18n.changeLanguage(i18n.language === Lang.ru ? Lang.en : Lang.ru);
  }, [i18n]);
  return (
    <div className="absolute bottom-0 w-full mb-4">
      <div className="flex items-center bg-new-dark-grey p-4 justify-between rounded-[10px] h-[50px]">
        <Label htmlFor="switch-language" className="text-[14px] text-white">
          {t("ПЕРЕКЛЮЧИТЬ НА ЯЗЫК")}
        </Label>
        <Switch onCheckedChange={toggle} id="switch-language" className="" />
      </div>
    </div>
  );
};
