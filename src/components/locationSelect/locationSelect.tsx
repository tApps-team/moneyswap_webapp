import { FC, memo, useCallback, useState } from "react";
import clsx from "clsx";
import { ModalCountries } from "../modalCountries/modalCountries";
import styles from "./locationSelect.module.scss";
import {
  useCashStore,
  useDirectionTabsStore,
  useFiltersStore,
} from "../../legacy/store/store";
import { useFetchCashCountries } from "../../legacy/api/api";
import { useTranslation } from "react-i18next";
import { directionTabsValute } from "@/shared/consts";
import { LocationIcon } from "@/shared/assets/icons/LocationIcon";

interface LocationSelectProps {}

export const LocationSelect: FC<LocationSelectProps> = memo(() => {
  const [show, setShow] = useState(false);
  const handleModal = useCallback(() => {
    setShow((prevShow) => !prevShow);
  }, []);

  const { location } = useCashStore((state) => state);
  const setSearch = useFiltersStore((state) => state.setSearch);
  const { t, i18n } = useTranslation();
  const { data: countries } = useFetchCashCountries();
  const typeValute = useDirectionTabsStore((state) => state.typeValute);

  const currentCountryName =
    i18n.language === "ru"
      ? location?.location.country.name.ru
      : location?.location.country.name.en;
  const currentCityName =
    i18n.language === "ru"
      ? location?.location.city.name.ru
      : location?.location.city.name.en;

  const handleShowModal = () => {
    handleModal();
    setSearch("");
  };

  return (
    <section
      className={clsx(styles.location, {
        [styles.location__active]: typeValute === directionTabsValute[1].value,
      })}
    >
      <header className={styles.header} onClick={handleShowModal}>
        <figure className={styles.figure}>
          {location?.location ? (
            <img
              src={location?.location.country.icon_url}
              alt={`Иконка ${location?.location.country.name}`}
            />
          ) : (
            // <img src="/img/locationIcon.png" alt={`Иконка`} />
            <LocationIcon />
          )}
        </figure>
        <h3 className={styles.selectCountry}>
          {location
            ? `${currentCountryName}, ${currentCityName}`
            : t("Выберите страну и город")}
        </h3>
      </header>
      <div className={clsx(styles.modal, { [styles.active]: show })}>
        {countries && (
          <ModalCountries
            show={show}
            countries={countries}
            handleModal={handleModal}
          />
        )}
      </div>
    </section>
  );
});
