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
import { exchangerAPI } from "@/entities/exchanger";

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
    // dispatch(exchangerAPI.util.resetApiState());
  };

  const filteredCountries = countries?.map((country) => `item-${country?.id}`);

  return (
    <Accordion
      value={searchValue.length > 0 ? filteredCountries : undefined}
      type="multiple"
      className="grid gap-[10px]"
    >
      {countries?.map((country) => (
        <AccordionItem value={`item-${country?.id}`} key={country?.id}>
          <AccordionTrigger className="px-[15px] py-[20px] relative bg-[#2d2d2d] rounded-[35px] h-[70px]">
            <CountryCard country={country} />
          </AccordionTrigger>
          <AccordionContent>
            {country?.cities?.map((city) => (
              <DrawerClose key={city?.id} className="w-full">
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
