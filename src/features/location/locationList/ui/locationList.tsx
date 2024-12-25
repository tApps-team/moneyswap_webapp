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
  const dispatch = useAppDispatch();
  const changeLocation = (location: { city: City; country: Country }) => {
    dispatch(setCity(location?.city));
    dispatch(setCountry(location?.country));
    setSearchValue("");
    dispatch(currencyActions.setGetCashCurrency(null));
    dispatch(currencyActions.setGiveCashCurrency(null));
  };

  const filteredCountries = countries?.map((country) => `item-${country?.id}`);

  return (
    <Accordion
      value={searchValue.length > 0 ? filteredCountries : undefined}
      type="multiple"
      className="grid gap-0 pb-4"
    >
      {countries?.map((country) => (
        <AccordionItem
          value={`item-${country?.id}`}
          key={country?.id}
          className="px-0 py-0 grid bg-transparent [&>div[data-state=open]]:bg-new-light-grey"
        >
          <AccordionTrigger className="relative border-0 px-5 py-3 [&[data-state=open]]:text-black [&[data-state=open]]:bg-mainColor">
            <CountryCard country={country} />
          </AccordionTrigger>
          <AccordionContent className="py-4 px-5 grid gap-6 text-white">
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
