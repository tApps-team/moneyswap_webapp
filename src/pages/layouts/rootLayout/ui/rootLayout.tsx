import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { Toaster } from "@/shared/ui";
import { BottomNav } from "@/widgets/bottomNav";
import { isTelegramMobile } from "@/shared/lib";
import { RootBg } from "./rootBg";
import styles from "./rootLayout.module.scss";

export const RootLayout = () => {
  const isMobilePlatform = isTelegramMobile();

  return (
    <div className={clsx(styles.root__container, {
      [styles.root__container_mobile]: isMobilePlatform
    })}>
      <Toaster />
      {/*
        BottomNav обязан быть внутри Suspense: он вызывает useTranslation, а i18next
        подгружает словари по http и приостанавливает рендер (useSuspense включён по умолчанию).
        Вне границы это роняло приложение в ErrorBoundary роутера.
      */}
      <Suspense fallback={<div>Loading...</div>}>
        <main className={styles.root__content}>
          <Outlet />
          <RootBg />
        </main>
        <BottomNav />
      </Suspense>
    </div>
  );
};
