import {
  City,
  CityCard,
  Country,
  CountryCard,
  setCity,
  setCountry,
} from "@/entities/location";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DrawerClose,
} from "@/shared/ui";
import { useAppDispatch } from "@/shared/hooks";
import { currencyActions } from "@/entities/currency";
import { useTranslation } from "react-i18next";
import { handleVibration, reachGoal, YandexGoals } from "@/shared/lib";

interface LocationListProps {
  countries: Country[];
  setSearchValue: (value: string) => void;
  searchValue: string;
}

export const LocationList: FC<LocationListProps> = ({
  countries,
  setSearchValue,
  searchValue,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const changeLocation = (location: { city: City; country: Country }) => {
    dispatch(setCity(location?.city));
    dispatch(setCountry(location?.country));
    setSearchValue("");
    dispatch(currencyActions.setGetCashCurrency(null));
    dispatch(currencyActions.setGiveCashCurrency(null));
    reachGoal(YandexGoals.CASH_COUNTRY_SELECT);
    handleVibration();
  };

  const filteredCountries = countries?.map((country) => `item-${country?.id}`);

  return (
    <Accordion
      value={searchValue.length > 0 ? filteredCountries : undefined}
      type="multiple"
      className="grid gap-4 pb-4 pt-4"
    >
      {countries?.map((country) => (
        <AccordionItem
          value={`item-${country?.id}`}
          key={country?.id}
          className="relative px-0 py-0 grid bg-transparent group"
        >
          {country.is_popular && (
            <span
              className={
                "z-10 absolute right-2 -translate-y-3 text-[10px] rounded-[3px] bg-mainColor text-black text-center py-[2px] px-2 font-medium border border-new-dark-grey group-data-[state=open]:border-mainColor group-data-[state=open]:text-mainColor group-data-[state=open]:bg-new-dark-grey"
              }
            >
              {t("Popular")}
            </span>
          )}
          <AccordionTrigger className="relative border-0 px-5 py-2 group-data-[state=open]:text-black group-data-[state=open]:bg-mainColor">
            <CountryCard country={country} />
          </AccordionTrigger>
          <AccordionContent className="py-4 px-5 grid gap-6 text-white group-data-[state=open]:bg-new-light-grey">
            {country?.cities?.map((city) => (
              <DrawerClose key={city?.id} className="w-full px-0 pl-[6px]">
                <CityCard
                  city={city}
                  changeLocation={() => changeLocation({ city, country })}
                />
              </DrawerClose>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
