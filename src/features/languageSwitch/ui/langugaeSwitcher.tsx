import { Label, Switch } from "@/shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggle = useCallback(async () => {
    i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
  }, [i18n]);
  return (
    <div className="flex">
      <Label htmlFor="switch-language">Переключить на английский</Label>
      <Switch onCheckedChange={toggle} id="switch-language" />
    </div>
  );
};
