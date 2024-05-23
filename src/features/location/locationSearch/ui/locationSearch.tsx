import { FC } from "react";
import styles from "./locationSearch.module.scss";
import { SearchIcon } from "@/shared/assets";
import { useTranslation } from "react-i18next";

interface LocationSearchProps {
  searchValue: string;
  onChange: (value: string) => void;
}

export const LocationSearch: FC<LocationSearchProps> = ({
  searchValue,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <section className={styles.search}>
      <span className={styles.icon}>
        <SearchIcon width="30px" height="30px" />
      </span>
      <input
        className={styles.input}
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("Поиск страны и города")}
      />
    </section>
  );
};
