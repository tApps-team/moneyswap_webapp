import clsx from "clsx";
import styles from "./countryCard.module.scss";
import { FC } from "react";
import { Country } from "../../model";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";

interface CountryCardProps {
  country: Country;
  active?: boolean;
}

export const CountryCard: FC<CountryCardProps> = ({ country, active }) => {
  const { i18n } = useTranslation();
  return (
    <header
      className={clsx(styles.item, {
        [styles.active]: active,
      })}
    >
      <figure className={styles.icon}>
        <img src={country?.icon_url} alt={`Иконка ${country?.name.ru}`} />
      </figure>
      <h3 className={styles.name}>
        {i18n.language === Lang.ru ? country?.name?.ru : country?.name?.en}
      </h3>
    </header>
  );
};
