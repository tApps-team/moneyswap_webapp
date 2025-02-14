import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckQueries } from "../checkQueries";
import { Lang } from "@/shared/config";

export const LanguageDetector = () => {
  const { i18n } = useTranslation();
  const lang = CheckQueries().user_lang;
  useEffect(() => {
    if (lang && (lang === Lang.ru || lang === Lang.en)) {
      i18n.changeLanguage(lang);
    } else {
      const currentLang = i18n.language.split("-");
      i18n.changeLanguage(currentLang[0]);
    }
  }, []);
  return <></>;
};
