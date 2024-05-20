import { directions } from "@/entities/direction";
import { useGetCountriesQuery } from "@/entities/location/api/locationApi";
import { LocationList, LocationSearch } from "@/features/location";
import { useAppSelector } from "@/shared/hooks";
import { useMemo, useState } from "react";
import styles from "./locations.module.scss";
import { useTranslation } from "react-i18next";
import { CloseDrawerIcon, LocationIcon, LogoIcon } from "@/shared/assets";
import clsx from "clsx";
import { Country } from "@/entities/location";
import { Lang } from "@/shared/config";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  ScrollArea,
} from "@/shared/ui";

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
    skip: activeDirection !== directions.cash || !!country,
  });

  // search filter
  const filteredCountries = useMemo(
    () =>
      countries &&
      countries
        .map((country) => {
          const isCountryMatch =
            i18n.language === Lang.ru
              ? country?.name?.ru
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              : country?.name?.en
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());
          const filteredCountry = {
            ...country,
            cities: isCountryMatch
              ? country.cities
              : country.cities.filter((city) =>
                  i18n.language === Lang.ru
                    ? city?.name?.ru
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    : city?.name?.en
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
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

  return (
    <section
      className={clsx(styles.location, {
        [styles.location__active]: activeDirection === directions.cash,
      })}
    >
      <Drawer>
        <DrawerTrigger asChild>
          <header className={styles.header}>
            <figure className={styles.figure}>
              {country ? (
                <img
                  src={country?.icon_url}
                  alt={`Иконка ${currentCountryName}`}
                />
              ) : (
                <LocationIcon />
              )}
            </figure>
            <h2 className={styles.locationSelect}>
              {city && country ? (
                <p>
                  <span>{currentCountryName},</span> {currentCityName}
                </p>
              ) : (
                t("Выберите страну и город")
              )}
            </h2>
          </header>
        </DrawerTrigger>
        <DrawerContent className="h-[100svh] border-none rounded-none bg-transparent">
          <DrawerHeader className="gap-4 pt-8">
            <div className="flex justify-center items-center">
              <LogoIcon width="80px" height="80px" />
            </div>
            <div className="relative">
              <h2 className="text-left text-base uppercase text-[#f6ff5f]">
                {t("Выбор страны и города")}
              </h2>
              <DrawerClose className="absolute right-0 top-0">
                <CloseDrawerIcon width={26} height={26} />
              </DrawerClose>
            </div>
            <LocationSearch
              onChange={setSearchValue}
              searchValue={searchValue}
            />
          </DrawerHeader>
          <ScrollArea data-vaul-no-drag className="h-full p-4 pt-0 w-full ">
            <LocationList
              countries={filteredCountries!}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </section>
  );
};