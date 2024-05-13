import {
  City,
  CityCard,
  Country,
  CountryCard,
  setCity,
  setCountry,
} from "@/entities/location";
import { FC } from "react";
import styles from "./locationList.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";
import { useAppDispatch } from "@/shared/hooks";

interface LocationListProps {
  countries: Country[];
  setSearchValue: (value: string) => void;
}

export const LocationList: FC<LocationListProps> = ({
  countries,
  setSearchValue,
}) => {
  const dispatch = useAppDispatch();
  const changeLocation = (location: { city: City; country: Country }) => {
    dispatch(setCity(location.city));
    dispatch(setCountry(location.country));
    setSearchValue("");
    // close drawer
    // очищать exchangers и currency selects
  };
  return (
    <Accordion type="single" collapsible className="grid gap-[10px]">
      {countries?.map((country) => (
        <AccordionItem value={`item-${country?.id}`} key={country?.id}>
          <AccordionTrigger className="px-[15px] py-[20px] relative bg-[#2d2d2d] rounded-[35px] h-[70px]">
            <CountryCard country={country} />
          </AccordionTrigger>
          <AccordionContent>
            {country?.cities?.map((city) => (
              <CityCard
                city={city}
                key={city?.id}
                changeLocation={() => changeLocation({ city, country })}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
