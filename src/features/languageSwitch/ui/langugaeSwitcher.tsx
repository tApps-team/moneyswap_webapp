import { Lang } from "@/shared/config";
import { handleVibration } from "@/shared/lib";
import { Label, Switch } from "@/shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Переключатель языка интерфейса. Живёт во вкладке «Ещё»:
 * раньше был прибит к низу экрана обмена, но там теперь нижнее меню.
 */
export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggle = useCallback(() => {
    handleVibration();
    i18n.changeLanguage(i18n.language === Lang.ru ? Lang.en : Lang.ru);
  }, [i18n]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] bg-new-dark-grey p-4">
      <Label htmlFor="switch-language" className="text-sm text-white">
        {t("ПЕРЕКЛЮЧИТЬ НА ЯЗЫК")}
      </Label>
      <Switch
        id="switch-language"
        checked={i18n.language === Lang.en}
        onCheckedChange={toggle}
      />
    </div>
  );
};
