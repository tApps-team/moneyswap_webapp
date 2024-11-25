import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const LanguageDetector = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    const currentLang = i18n.language.split("-");
    i18n.changeLanguage(currentLang[0]);
  }, []);
  return <></>;
};
