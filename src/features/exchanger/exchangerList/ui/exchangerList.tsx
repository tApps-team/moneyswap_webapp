import { Exchanger, ExchangerCard } from "@/entities/exchanger";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./exchangerList.module.scss";
import { City } from "@/entities/location";
import { Lang } from "@/shared/config";
import { ReviewDrawer } from "@/widgets/reviewDrawer";
import { Currency } from "@/entities/currency";

interface ExchangersListProps {
  exchangers: Exchanger[];
  giveCurrency: Currency;
  getCurrency: Currency;
  city: City | null;
}

export const ExchangerList: FC<ExchangersListProps> = memo(
  ({ exchangers, giveCurrency, getCurrency, city }) => {
    const { t, i18n } = useTranslation();
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
    const giveCurrencyName =
      i18n.language === Lang.ru
        ? giveCurrency?.name?.ru
        : giveCurrency?.name?.en;
    const getCurrencyName =
      i18n.language === Lang.ru ? getCurrency?.name?.ru : getCurrency?.name?.en;
    return (
      <section className={styles.exchangersList}>
        <div className={styles.header}>
          <h2 className="font_unbounded">{t("Лучшие курсы")}</h2>
          <h3>
            <span>{giveCurrencyName}</span> {t("на")}{" "}
            <span>{getCurrencyName}</span>
          </h3>
        </div>
        <div className={styles.cards}>
          {exchangers &&
            exchangers.map((exchanger) => (
              <ExchangerCard
                key={exchanger?.id}
                card={exchanger}
                city={city && city}
                openLink={openLink}
                ReviewSlot={<ReviewDrawer exchanger={exchanger} />}
              />
            ))}
        </div>
      </section>
    );
  }
);
