import { FC, memo } from "react";
import { City, Country } from "../../legacy/model";
import styles from "./cityCard.module.scss";
import { useCashStore, useSelectsStore } from "../../legacy/store/store";
import { useTranslation } from "react-i18next";

import { useQueryClient } from "react-query";
import { exchangersKey } from "@/shared/consts";

interface CityCardProps {
  city: City;
  country: Country;
  handleModal: () => void;
}

export const CityCard: FC<CityCardProps> = memo(
  ({ city, country, handleModal }) => {
    const { setLocation } = useCashStore((state) => state);
    // clear selects
    const { setGiveSelect, setGetSelect } = useSelectsStore((state) => state);

    const { i18n } = useTranslation();

    // clear exchangers data
    const queryClient = useQueryClient();
    const clearExchangers = () => {
      queryClient.removeQueries([exchangersKey]);
    };

    // location change
    const handleChangeLocation = () => {
      handleModal();
      const newLocation = {
        location: {
          country: country,
          city: city,
        },
      };
      setGiveSelect(null);
      setGetSelect(null);
      setLocation(newLocation);
      clearExchangers();
    };

    return (
      <li className={styles.city} onClick={handleChangeLocation}>
        <h3 className={styles.name}>
          {i18n.language === "ru" ? city.name.ru : city.name.en}
        </h3>
      </li>
    );
  }
);
