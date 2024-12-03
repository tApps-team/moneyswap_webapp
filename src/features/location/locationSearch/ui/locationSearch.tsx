import { FC } from "react";
import styles from "./locationSearch.module.scss";
import { SearchIcon } from "@/shared/assets";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/ui";

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
    // <section className={styles.search}>
    //   <span className={styles.icon}>
    //     <SearchIcon width="30px" height="30px" />
    //   </span>
    //   <Input
    //     className={styles.input}
    //     value={searchValue}
    //     onChange={(e) => onChange(e.target.value)}
    //     placeholder={t("Поиск страны и города")}
    //   />
    // </section>
    <div className="relative">
      <SearchIcon className="absolute left-2 translate-y-[6px] size-[30px]" />
      <Input
        placeholder={t("Поиск страны и города")}
        className="text-[16px] rounded-2xl font-medium pl-12 bg-lightGray border-none placeholder:text-darkGray placeholder:transition-opacity text-darkGray focus:placeholder:opacity-0"
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
