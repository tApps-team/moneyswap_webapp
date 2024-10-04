import { useEffect, useState } from "react";
import styles from "./rootBg.module.scss";
import clsx from "clsx";

export const RootBg = () => {
  const [isActiveOverlay, setActiveOverlay] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setActiveOverlay(false);
    }, 100);
  }, []);
  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(styles.overlay, {
          [styles.active_overlay]: isActiveOverlay,
        })}
      ></div>
    </div>
  );
};
