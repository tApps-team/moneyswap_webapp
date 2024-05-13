import clsx from "clsx";
import styles from "./directionCard.module.scss";
import { FC } from "react";
import { directions } from "../model/directionTypes";
import { useTranslation } from "react-i18next";

interface DirectionCardProps {
  type: directions;
  isActive: boolean;
  handleDirection: (direction: directions) => void;
}

export const DirectionCard: FC<DirectionCardProps> = ({
  type,
  isActive,
  handleDirection,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(styles.direction, {
        [styles.active]: isActive,
      })}
      onClick={() => handleDirection(type)}
    >
      <p className={styles.direction__title}>
        {t(
          `${
            type === directions.cash ? "directions.cash" : "directions.noncash"
          }`
        )}
      </p>
    </div>
  );
};
