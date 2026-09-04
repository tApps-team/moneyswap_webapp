import { FC } from "react";
import { useAppNavigation } from "@/shared/routing";
import { ShareButton } from "../share-button";

interface ShareCurrentButtonProps {
  /** Что подставить в текст пересылки: название раздела или агента. */
  label?: string;
  className?: string;
}

/**
 * «Поделиться» текущим экраном рейтингов.
 *
 * Состояние берём прямо из адресной строки, поэтому компонент можно ставить куда угодно
 * внутри вкладок — прокидывать пропсы через explorer'ы не нужно.
 */
export const ShareCurrentButton: FC<ShareCurrentButtonProps> = ({ label, className }) => {
  const { tab, section, item } = useAppNavigation();

  return <ShareButton params={{ tab, section, item }} label={label} className={className} />;
};
