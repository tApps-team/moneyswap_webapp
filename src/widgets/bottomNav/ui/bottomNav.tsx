import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Menu, ShieldAlert, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { appTabs, useAppNavigation } from "@/shared/routing";
import { useDrawerBackButton } from "@/shared/hooks";
import { handleVibration } from "@/shared/lib";
import styles from "./bottomNav.module.scss";

const TABS: { tab: appTabs; icon: LucideIcon; labelKey: string }[] = [
  { tab: appTabs.exchange, icon: ArrowLeftRight, labelKey: "nav.exchange" },
  { tab: appTabs.ratings, icon: Star, labelKey: "nav.ratings" },
  { tab: appTabs.blacklist, icon: ShieldAlert, labelKey: "nav.blacklist" },
  { tab: appTabs.more, icon: Menu, labelKey: "nav.more" },
];

export const BottomNav: FC = () => {
  const { t } = useTranslation();
  const { tab, openTab, goBack, canGoBack } = useAppNavigation();

  /**
   * Навигационный уровень кнопки «Назад» Telegram: приоритет 0, поэтому любой открытый
   * drawer (приоритет 1) или диалог (2) перехватывает нажатие раньше.
   */
  useDrawerBackButton({ isOpen: canGoBack, onClose: goBack, priority: 0 });

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {TABS.map(({ tab: value, icon: Icon, labelKey }) => {
          const isActive = tab === value;
          return (
            <button
              key={value}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                handleVibration();
                openTab(value);
              }}
              className={clsx(styles.tab, { [styles.tab_active]: isActive })}
            >
              <Icon className={styles.icon} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={styles.label}>{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
