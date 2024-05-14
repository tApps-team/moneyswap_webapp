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

// import { memo, useCallback } from "react";
// import { useTranslation } from "react-i18next";

// import styles from "./languageSwitcher.module.scss";
// import { RussiaIcon } from "@/shared/assets/icons/IconRussia";
// import { USAIcon } from "@/shared/assets/icons/IconUsa";
// import { Switch } from "@/shared/ui";

// export const LanguageSwitcher = memo(() => {
//   const { i18n } = useTranslation();

//   // const [spring, setSpring] = useSpring(() => ({
//   //   from: { transform: "translateY(20px)", opacity: 0 },
//   //   to: { transform: "translateY(0px)", opacity: 1 },
//   //   config: { duration: 500 },
//   // }));

//   const toggle = useCallback(async () => {
//     // setSpring({ transform: "translateY(3px)" });
//     // await new Promise((resolve) => setTimeout(resolve, 200));
//     i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
//     // setSpring({ transform: "translateY(0px)" });
//   }, [i18n]);

//   const currentLang = i18n.language === "en" ? "Русский" : "English";
//   const currentIcon =
//     i18n.language === "en" ? (
//       <RussiaIcon width="50px" height="50px" />
//     ) : (
//       <USAIcon width="50px" height="50px" />
//     );
//   return (
//     <div className={styles.languageSwitcher}>
//       <span className={styles.currentIcon}>{currentIcon}</span>
//       <label className={styles.currentLang}>{currentLang}</label>
//       <Switch onCheckedChange={toggle} id="switch-language" />
//     </div>
//   );
// });
