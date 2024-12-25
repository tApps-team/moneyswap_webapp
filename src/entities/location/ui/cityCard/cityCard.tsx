import styles from "./cityCard.module.scss";
import { FC } from "react";
import { City } from "../../model";
import { useTranslation } from "react-i18next";
import { LogoArrow } from "@/shared/assets";
import { Lang } from "@/shared/config";

interface CityCardProps {
  city: City;
  changeLocation: () => void;
}

export const CityCard: FC<CityCardProps> = ({ city, changeLocation }) => {
  const { i18n } = useTranslation();
  return (
    <header className={styles.item} onClick={changeLocation}>
      <figure className={styles.icon}>
        <LogoArrow className="rotate-180 w-[22px] h-[22px]" fill="#fff" />
      </figure>
      <h3 className={styles.name}>
        {i18n.language === Lang.ru ? city?.name?.ru : city?.name?.en}
      </h3>
    </header>
  );
};
