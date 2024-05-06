import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { Popup } from "../ui/popup";
import { Country } from "../../model";
import { CountryCard } from "../countryCard";
import styles from "./modalCountries.module.scss";
import { OptionSearch } from "../optionSearch";
import { useFiltersStore } from "../../store/store";
import { useTranslation } from "react-i18next";

interface ModalCountriesProps {
  handleModal: () => void;
  countries: Country[];
  show: boolean;
}

export const ModalCountries: FC<ModalCountriesProps> = memo(
  ({ countries, handleModal, show }) => {
    // cities search
    const search = useFiltersStore((state) => state.search.toLowerCase());

    const { t, i18n } = useTranslation();
    // const currentLanguage = (country: Country) => {
    //   const language =
    //     i18n.language === "ru" ? country?.name?.ru : country?.name?.en;
    //   return language;
    // };
    const filteredOptions = useMemo(
      () =>
        countries
          .map((country) => {
            const isCountryMatch =
              i18n.language === "ru"
                ? country?.name?.ru.toLowerCase().includes(search)
                : country?.name?.en.toLowerCase().includes(search);
            const filteredCountry = {
              ...country,
              cities: isCountryMatch
                ? country.cities
                : country.cities.filter((city) =>
                    i18n.language === "ru"
                      ? city?.name?.ru.toLowerCase().includes(search)
                      : city?.name?.en.toLowerCase().includes(search)
                  ),
            };
            if (isCountryMatch || filteredCountry.cities.length > 0) {
              return filteredCountry;
            }
            return null;
          })
          .filter((country) => country !== null),
      [countries, i18n.language, search]
    );

    // accrodion logic
    const [accordionStates, setAccordionStates] = useState<{
      [key: number]: boolean;
    }>({});
    const handleAccordion = (countryId: number) => {
      setAccordionStates((prevStates) => {
        const newStates: { [key: number]: boolean } = { ...prevStates };
        if (search) {
          newStates[countryId] = !prevStates[countryId];
        } else {
          Object.keys(newStates).forEach((key) => {
            const numericKey = parseInt(key, 10);
            if (!isNaN(numericKey) && numericKey !== countryId) {
              newStates[numericKey] = false;
            }
          });
          newStates[countryId] = !prevStates[countryId];
        }
        return newStates;
      });
    };

    useEffect(() => {
      if (search) {
        const allOpenStates: { [key: number]: boolean } = {};
        filteredOptions.forEach((country) => {
          if (country) {
            allOpenStates[country.id] = true;
          }
        });
        setAccordionStates(allOpenStates);
      } else {
        setAccordionStates({});
      }
    }, [search]);

    const ulRef = useRef<HTMLUListElement | null>(null);

    // clear accordions when modal closed
    useEffect(() => {
      setAccordionStates({});
      if (ulRef.current && show) {
        ulRef.current.scrollTop = 0;
      }
    }, [show]);

    return (
      <Popup closeModal={handleModal} show={show}>
        <section className={styles.countriesPopup}>
          <h2 className={styles.title}>{t("Выбор страны и города")}</h2>
          <div className={styles.search__container}>
            <OptionSearch type="cash" />
          </div>
          {filteredOptions.length > 0 ? (
            <ul className={styles.countries} ref={ulRef}>
              {filteredOptions.map(
                (country) =>
                  country && (
                    <CountryCard
                      key={country.id}
                      country={country}
                      handleModal={handleModal}
                      accordion={accordionStates[country.id] || false}
                      setAccordion={() => handleAccordion(country.id)}
                    />
                  )
              )}
            </ul>
          ) : (
            <p className={styles.errorMessages}>{t("Ничего не найдено...")}</p>
          )}
        </section>
      </Popup>
    );
  }
);
