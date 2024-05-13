import { Exchanger, ExchangerCard } from "@/entities/exchanger";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./exchangerList.module.scss";
import { City } from "@/entities/location";

interface ExchangersListProps {
  exchangers: Exchanger[];
  currencyGive: any;
  currencyGet: any;
  city: City | null;
}

export const ExchangerList: FC<ExchangersListProps> = memo(
  ({ exchangers, currencyGet, currencyGive, city }) => {
    const { t } = useTranslation();

    // telegram open link method
    const tg = window.Telegram.WebApp;
    const options = [{ try_instant_view: true }];
    const isTelegramLink = (url: string): boolean => {
      const telegramLinkPattern = /(?:t\.me|telegram\.me)\/[^/\s]+\/?$/;
      return telegramLinkPattern.test(url);
    };
    const openLink = (url: string) => {
      if (isTelegramLink(url)) {
        tg.openTelegramLink(url);
      } else {
        tg.openLink(url, options);
      }
    };
    return (
      <section className={styles.exchangersList}>
        <h2 className={styles.header}>
          {t("Лучшие курсы")} {currencyGive?.name} {t("на")} {currencyGet?.name}
        </h2>
        <div className={styles.cards}>
          {exchangers &&
            exchangers.map((card) => (
              <ExchangerCard
                key={card?.id}
                card={card}
                city={city && city}
                openLink={openLink}
              />
            ))}
        </div>
      </section>
    );
  }
);
