import { Outlet } from "react-router-dom";
import styles from "./rootLayout.module.scss";
import { RootBg } from "./rootBg";
import { Toaster } from "@/shared/ui";

export const RootLayout = () => {
  return (
    <div className={styles.root__container}>
      <Toaster />
      <main className={styles.root__content}>
        <Outlet />
        <RootBg />
      </main>
    </div>
  );
};
