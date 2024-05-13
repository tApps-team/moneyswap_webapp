import { directions } from "@/entities/direction";
import { useGetCountriesQuery } from "@/entities/location/api/locationApi";
import { LocationList, LocationSearch } from "@/features/location";
import { useAppSelector } from "@/shared/hooks";
import { useMemo, useState } from "react";
import styles from "./locations.module.scss";
import { useTranslation } from "react-i18next";
import { LocationIcon } from "@/shared/assets";
import clsx from "clsx";
import { Country } from "@/entities/location";
import { Lang } from "@/shared/config";

export const Location = () => {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");
  const { activeDirection } = useAppSelector((state) => state.direction);
  const { city, country } = useAppSelector((state) => state.location);
  const currentCountryName =
    i18n.language === Lang.ru ? country?.name?.ru : country?.name?.en;
  const currentCityName =
    i18n.language === Lang.ru ? city?.name?.ru : city?.name?.en;

  // query rtk
  const { data: countries } = useGetCountriesQuery("", {
    skip: activeDirection !== directions.cash,
  });

  // search filter
  const filteredCountries = useMemo(
    () =>
      countries &&
      countries
        .map((country) => {
          const isCountryMatch =
            i18n.language === Lang.ru
              ? country?.name?.ru.toLowerCase().includes(searchValue)
              : country?.name?.en.toLowerCase().includes(searchValue);
          const filteredCountry = {
            ...country,
            cities: isCountryMatch
              ? country.cities
              : country.cities.filter((city) =>
                  i18n.language === Lang.ru
                    ? city?.name?.ru.toLowerCase().includes(searchValue)
                    : city?.name?.en.toLowerCase().includes(searchValue)
                ),
          };
          if (isCountryMatch || filteredCountry?.cities?.length > 0) {
            return filteredCountry;
          }
          return null;
        })
        .filter((country): country is Country => country !== null),
    [countries, i18n.language, searchValue]
  );

  //   const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <section
      className={clsx(styles.location, {
        [styles.location__active]: activeDirection === directions.cash,
      })}
    >
      <header className={styles.header}>
        <figure className={styles.figure}>
          {country ? (
            <img src={country?.icon_url} alt={`Иконка ${currentCountryName}`} />
          ) : (
            <LocationIcon />
          )}
        </figure>
        <h2 className={styles.locationSelect}>
          {city && country
            ? `${currentCountryName}, ${currentCityName}`
            : t("Выберите страну и город")}
        </h2>
      </header>
      <div>
        <h2 className={styles.title}>{t("Выбор страны и города")}</h2>
        <LocationSearch onChange={setSearchValue} searchValue={searchValue} />
        <LocationList
          countries={filteredCountries!}
          setSearchValue={setSearchValue}
        />
      </div>
    </section>
  );
};
