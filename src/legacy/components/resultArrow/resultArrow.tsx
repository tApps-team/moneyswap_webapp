import { memo } from "react";

import styles from "./resultArrow.module.scss";
import clsx from "clsx";
import { IconDown } from "@/shared/assets/icons/IconDown";
import { IconUp } from "@/shared/assets/icons/IconUp";
type ResultArrowProps = {
  isSuccess: boolean;
};
export const ResultArrow = memo((props: ResultArrowProps) => {
  const { isSuccess } = props;

  return (
    <section
      className={clsx(styles.arrowResultContainer, {
        [styles.activeResultContainer]: isSuccess,
      })}
    >
      {isSuccess ? (
        <IconDown fill="black" className={styles.arrowIcon} />
      ) : (
        <IconUp fill="black" className={styles.arrowIcon} />
      )}
    </section>
  );
});
