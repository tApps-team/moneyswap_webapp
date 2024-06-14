import { setUser } from "@/entities/user";
import { useAppDispatch } from "@/shared/hooks";
import { useEffect } from "react";

export const TelegramApi = () => {
  const dispatch = useAppDispatch();
  // инициализация webapp
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    tg.enableClosingConfirmation();
    tg.ready();
    if (tg?.initDataUnsafe) {
      dispatch(setUser(tg?.initDataUnsafe?.user));
    }
  }, []);

  return <div></div>;
};
