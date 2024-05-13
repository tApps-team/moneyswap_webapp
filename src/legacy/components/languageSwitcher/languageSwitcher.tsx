import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Switch } from "../ui/switch";
import styles from "./languageSwitcher.module.scss";
import { RussiaIcon } from "@/shared/assets/icons/IconRussia";
import { USAIcon } from "@/shared/assets/icons/IconUsa";
import { Lang } from "@/shared/config";

export const LanguageSwitcher = memo(() => {
  const { i18n } = useTranslation();

  // const [spring, setSpring] = useSpring(() => ({
  //   from: { transform: "translateY(20px)", opacity: 0 },
  //   to: { transform: "translateY(0px)", opacity: 1 },
  //   config: { duration: 500 },
  // }));

  const toggle = useCallback(async () => {
    // setSpring({ transform: "translateY(3px)" });
    // await new Promise((resolve) => setTimeout(resolve, 200));
    i18n.changeLanguage(i18n.language === Lang.ru ? Lang.en : Lang.ru);
    // setSpring({ transform: "translateY(0px)" });
  }, [i18n]);

  const currentLang = i18n.language === Lang.en ? "Русский" : "English";
  const currentIcon =
    i18n.language === Lang.en ? (
      <RussiaIcon width="50px" height="50px" />
    ) : (
      <USAIcon width="50px" height="50px" />
    );
  return (
    <div className={styles.languageSwitcher}>
      <span className={styles.currentIcon}>{currentIcon}</span>
      <label className={styles.currentLang}>{currentLang}</label>
      <Switch onClick={toggle} />
    </div>
  );
});
