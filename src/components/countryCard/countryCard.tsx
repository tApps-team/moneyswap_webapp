// CountryCard.jsx

import React, { FC } from "react";
import { useSpring, animated, useTrail } from "react-spring";
import { Country } from "../../legacy/model";
import { CityCard } from "../cityCard";
import styles from "./countryCard.module.scss";

import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ArrowDown from "@/shared/assets/icons/ArrowDown";

interface CountryCardProps {
  country: Country;
  handleModal: () => void;
  accordion: boolean;
  setAccordion: (id: number) => void;
}

export const CountryCard: FC<CountryCardProps> = ({
  country,
  handleModal,
  accordion,
  setAccordion,
}) => {
  const { i18n } = useTranslation();

  const contentAnimation = useSpring({
    maxHeight: accordion ? "200vh" : "0",
    opacity: accordion ? 1 : 0,
    scale: accordion ? 1 : 0,

    config: {
      duration: accordion ? 200 : 0,
      tension: 210,
      friction: 20,
    },
  });

  const arrowAnimation = useSpring({
    transform: `rotate(${accordion ? 180 : 0}deg)`,
  });

  const trails = useTrail(country?.cities?.length || 0, {
    opacity: accordion ? 1 : 0,
    x: accordion ? 0 : 20,
    height: accordion ? 50 : 0,
    from: { opacity: 0, x: 20, height: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <div
      className={clsx(styles.country, {
        [styles.active__container]: accordion,
      })}
    >
      <header
        className={clsx(styles.header, {
          [styles.active_country]: accordion,
        })}
        onClick={() => setAccordion(country.id)}
      >
        <figure className={styles.imageContainer}>
          <img src={country.icon_url} alt={`Иконка ${country.name}`} />
        </figure>
        <h3 className={styles.name}>
          {i18n.language === "ru" ? country.name.ru : country.name.en}
        </h3>
        <animated.i className={styles.arrowIcon} style={arrowAnimation}>
          <ArrowDown color="#111111" width="35px" height="35px" />
        </animated.i>
      </header>
      <animated.section className={styles.list} style={contentAnimation}>
        {trails.map((props, index) => (
          <animated.ul key={index} style={props}>
            <CityCard
              key={country.cities[index].id}
              city={country.cities[index]}
              country={country}
              handleModal={handleModal}
            />
          </animated.ul>
        ))}
      </animated.section>
    </div>
  );
};
