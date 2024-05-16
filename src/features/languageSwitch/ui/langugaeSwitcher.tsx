import { Label, Switch } from "@/shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggle = useCallback(async () => {
    i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
  }, [i18n]);
  const label =
    i18n.language === "ru"
      ? t("ПЕРЕКЛЮЧИТЬ НА АНГЛИЙСКИЙ")
      : t("ПЕРЕКЛЮЧИТЬ НА РУССКИЙ");
  return (
    <div className="flex items-center bg-lightGray p-4 justify-between border rounded-full h-[50px]">
      <Label htmlFor="switch-language" className="uppercase text-xs">
        {label}
      </Label>
      <Switch onCheckedChange={toggle} id="switch-language" className="" />
    </div>
  );
};
