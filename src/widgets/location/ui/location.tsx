import { directions } from "@/entities/direction";
import { useGetCountriesQuery } from "@/entities/location/api/locationApi";
import { LocationList, LocationSearch } from "@/features/location";
import { useAppSelector } from "@/shared/hooks";
import { useMemo, useState } from "react";
import styles from "./locations.module.scss";
import { useTranslation } from "react-i18next";
import { CloseDrawerIcon, LocationIcon } from "@/shared/assets";
import clsx from "clsx";
import { Country } from "@/entities/location";
import { Lang } from "@/shared/config";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Empty,
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
    skip: activeDirection !== directions.cash,
  });

  // search filter
  const filteredCountries = useMemo(
    () =>
      countries &&
      countries
        .map((country) => {
          const isCountryMatch =
            country?.name?.ru
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase()) ||
            country?.name?.en
              ?.toLowerCase()
              ?.includes(searchValue?.toLowerCase());

          const filteredCities = country.cities.filter(
            (city) =>
              city?.name?.ru
                ?.toLowerCase()
                ?.includes(searchValue?.toLowerCase()) ||
              city?.name?.en
                ?.toLowerCase()
                ?.includes(searchValue?.toLowerCase()) ||
              city?.code_name
                ?.toLowerCase()
                ?.includes(searchValue?.toLowerCase())
          );

          if (isCountryMatch || filteredCities.length > 0) {
            return {
              ...country,
              cities: isCountryMatch ? country.cities : filteredCities,
            };
          }
          return null;
        })
        .filter((country): country is Country => country !== null),
    [countries, searchValue]
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
            <h2
              className={`${styles.locationSelect} ${
                activeDirection === directions.cash && "truncate"
              }`}
            >
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
        <DrawerContent className="min-h-svh border-none rounded-none bg-color-none">
          <DrawerHeader className="gap-4 pt-8">
            <div className="relative">
              <h2 className="text-left text-base uppercase text-[#f6ff5f] font-semibold">
                {t("Выбор страны и города")}
              </h2>
              <DrawerClose className="absolute right-0 top-0">
                <CloseDrawerIcon width={26} height={26} fill={"#f6ff5f"} />
              </DrawerClose>
            </div>
            <LocationSearch
              onChange={setSearchValue}
              searchValue={searchValue}
            />
          </DrawerHeader>
          <ScrollArea
            data-vaul-no-drag
            className="p-4 px-0 pt-0 h-[calc(100svh_-_129px)]"
          >
            {filteredCountries?.length ? (
              <LocationList
                countries={filteredCountries}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
              />
            ) : (
              <div className="grid justify-items-center gap-6 mt-8">
                <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
                <Empty text={t("Ничего не найдено...")} />
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </section>
  );
};
