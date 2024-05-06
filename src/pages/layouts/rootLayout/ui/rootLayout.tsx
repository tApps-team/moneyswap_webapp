import { Outlet } from "react-router-dom";
import styles from "./rootLayout.module.scss";

export const RootLayout = () => {
  return (
    <div className={styles.root__container}>
      <main className={styles.root__content}>
        <Outlet />
      </main>
    </div>
  );
};
