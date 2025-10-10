import { FC } from "react";
import { useTranslation } from "react-i18next";
import { LogoBig } from "@/shared/assets";
import { ScrollArea } from "@/shared/ui";
import { Frown } from "lucide-react";

interface UserNotFoundProps {
  exchanger_id: number;
}

export const UserNotFound: FC<UserNotFoundProps> = ({ exchanger_id }) => {
  const { t } = useTranslation();
  const tg = window?.Telegram?.WebApp;
  
  const goToBot = () => {
    const botUrl = `${import.meta.env.VITE_TG_BOT_URL}?start=new_review__${exchanger_id}`;
    tg?.close()
    // Для мобильных платформ используем openTelegramLink
    if (tg?.platform === 'ios' || tg?.platform === 'android') {
      tg?.openTelegramLink(botUrl);
    } else {
      // Для десктопа и веб используем openLink
      tg?.openLink(botUrl);
    }
  };

  return (
    <ScrollArea className="h-fit pt-6">
      <div className="flex justify-center items-center py-8">
        <LogoBig width={200} />
      </div>
      <div className="flex flex-col items-center gap-10 p-4 justify-between mx-2 grid-cols-1 rounded-[10px] px-4 py-8 bg-new-dark-grey">
        <div className="grid grid-flow-row gap-8 text-white">
          <div className="flex justify-center items-center">
            <Frown className="size-[80px] text-mainColor stroke-[1px]" />
          </div>
          <p className="text-mainColor mobile:text-xl text-lg text-center font-semibold uppercase">
            {t("reviews.error_404_title")}
          </p>
          <p className="text-base mobile:text-sm font-light text-center">
            {t("reviews.error_404")}
          </p>
        </div>
        <button
          onClick={goToBot}
          className="bg-mainColor text-base font-medium text-black px-5 py-3 rounded-[7px] truncate"
        >
          {t("reviews.error_404_btn")}
        </button>
      </div>
    </ScrollArea>
  );
};
