import { useEffect } from "react";
// import { useUserStore } from "../../store/store";

export const TelegramApi = () => {
  // инициализация webapp
  const tg = window.Telegram.WebApp;
  //   const { setUserData } = useUserStore((state) => state);

  useEffect(() => {
    tg.enableClosingConfirmation();
    tg.ready();
    // setUserData(tg.initDataUnsafe.user);
  }, []);

  return <div></div>;
};
