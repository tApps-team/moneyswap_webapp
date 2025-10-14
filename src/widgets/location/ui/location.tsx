import { Loader, SquareChevronRight } from "lucide-react";
import { directions } from "@/entities/direction";
import { LocationList, LocationSearch } from "@/features/location";
import { useAppSelector } from "@/shared/hooks";
import { useMemo, useState } from "react";
import styles from "./locations.module.scss";
import { useTranslation } from "react-i18next";
import { LocationArrow } from "@/shared/assets";
import clsx from "clsx";
import { Country, useGetCountriesQuery } from "@/entities/location";
import { Lang } from "@/shared/config";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Empty,
  ScrollArea,
} from "@/shared/ui";
import { handleVibration, isTelegramMobile } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { useDrawerBackButton } from "@/shared/hooks";

export const Location = () => {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeDirection } = useAppSelector((state) => state.direction);
  const { city, country } = useAppSelector((state) => state.location);
  const currentCountryName =
    i18n.language === Lang.ru ? country?.name?.ru : country?.name?.en;
  const currentCityName =
    i18n.language === Lang.ru ? city?.name?.ru : city?.name?.en;

  // query rtk
  const { data: countries, isLoading } = useGetCountriesQuery(null as unknown as string, {
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

  const isMobilePlatform = isTelegramMobile();

  // Используем хук для управления кнопкой назад Telegram
  useDrawerBackButton({
    isOpen,
    onClose: () => setIsOpen(false)
  });

  return (
    <section
      className={clsx(styles.location, {
        [styles.location__active]: activeDirection === directions.cash,
      })}
    >
      <Drawer direction={"right"} open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild onClick={() => handleVibration()}>
          <header
            className={`${styles.header} ${
              country
                ? "bg-none mx-4 justify-between gap-2"
                : "flex-row bg-[#43464E] justify-center gap-1"
            }`}
          >
            {country && (
              <figure className={styles.figure}>
                <img
                  src={country?.icon_url}
                  alt={`Иконка ${currentCountryName}`}
                />
              </figure>
            )}
            <h2
              className={`${styles.locationSelect} ${
                activeDirection === directions.cash && "truncate"
              } font-semibold`}
            >
              {city && country ? (
                <p className="truncate">
                  <span className="">{currentCountryName},</span>{" "}
                  {currentCityName}
                </p>
              ) : (
                t("Выберите страну и город")
              )}
            </h2>
            {country ? (
              <SquareChevronRight className="flex-shrink-0 w-6 h-6 stroke-white stroke-[1.5px]" />
            ) : (
              <div className="py-2.5">
                <LocationArrow className="flex-shrink-0 w-4 stroke-white -rotate-90" />
              </div>
            )}
          </header>
        </DrawerTrigger>
        <DrawerContent className={cn("min-h-svh border-none rounded-none bg-new-dark-grey", {
          "pt-[90px]": isMobilePlatform
        })}>
          <DrawerHeader className="gap-5 pt-6 pb-5 px-5">
            <div className="relative">
              <h2 className="text-left text-base uppercase text-[#f6ff5f] font-semibold">
                {t("Выбор страны и города")}
              </h2>
              <div className="absolute right-0 top-0">
              </div>
            </div>
            <LocationSearch
              onChange={setSearchValue}
              searchValue={searchValue}
            />
          </DrawerHeader>
          <ScrollArea
            data-vaul-no-drag
            className={clsx("px-0 pt-0 h-[calc(100svh_-_133px)]", {
              "h-[calc(100svh_-_220px)]": isMobilePlatform
            })}
          >
            {filteredCountries?.length ? (
              <LocationList
                countries={filteredCountries}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
              />
            ) : isLoading ? (
              <div className="grid justify-items-center gap-6 mt-8">
                <Loader className="animate-spin size-10 stroke-mainColor" />
              </div>
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
