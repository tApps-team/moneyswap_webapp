import {
  DirectionCard,
  directions,
  setActiveDirection,
} from "@/entities/direction";
import { setCity, setCountry } from "@/entities/location";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import styles from "./directions.module.scss";
import { FC } from "react";
import { reachGoal, YandexGoals } from "@/shared/lib";

export const Directions: FC = () => {
  const { activeDirection } = useAppSelector((state) => state.direction);
  const dispatch = useAppDispatch();

  const handleDirection = (direction: directions) => {
    setCity(null);
    setCountry(null);
    dispatch(setActiveDirection(direction));
    if (direction === directions.cash) {
      reachGoal(YandexGoals.SELECT_TYPE_CASH);
    } else {
      reachGoal(YandexGoals.SELECT_TYPE_CASHLESS);
    }
  };

  return (
    <section className={styles.directions}>
      <DirectionCard
        type={directions.noncash}
        isActive={activeDirection === directions.noncash}
        handleDirection={handleDirection}
      />
      <DirectionCard
        type={directions.cash}
        isActive={activeDirection === directions.cash}
        handleDirection={handleDirection}
      />
    </section>
  );
};
