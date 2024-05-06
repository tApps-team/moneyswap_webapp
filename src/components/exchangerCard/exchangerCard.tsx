import { FC, memo } from "react";
import { Exchanger } from "../../legacy/model/Exchanger";
import styles from "./exchangerCard.module.scss";

import { useTranslation } from "react-i18next";
import { Location } from "../../legacy/store/store";
import { RoundValute } from "../ui/roundValute";
import { animated, useInView } from "react-spring";
import ArrowRight from "@/shared/assets/icons/ArrowRight";

interface ExchangerCardProps {
  card: Exchanger;
  location: Location | null;
}

export const ExchangerCard: FC<ExchangerCardProps> = memo(
  ({ card, location }) => {
    const { t, i18n } = useTranslation();
    const currentCityName =
      i18n.language === "ru"
        ? location?.location.city.name.ru
        : location?.location.city.name.en;
    // Telegram object
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

    const [ref, springs] = useInView(() => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    }));

    return (
      <animated.article
        ref={ref}
        style={springs}
        className={styles.exchangerCard}
      >
        <a
          className={styles.cardLink}
          onClick={() => openLink(card.partner_link)}
          rel="noopener noreferrer"
        >
          <header className={styles.cardHeader}>
            <div className={styles.cardInfo}>
              <div>
                <h2 className={styles.cardName}>
                  {i18n.language === "ru" ? card.name.ru : card.name.en}
                </h2>
                <h3 className={styles.cityName}>
                  {location
                    ? `${t("В г.")} ${currentCityName}`
                    : t("Онлайн обмен")}
                </h3>
              </div>
              <div className={styles.reviewCountWrapper}>
                <h3 className={styles.reviewCountPositive}>
                  {card?.review_count}
                </h3>
                <span className={styles.separator}>|</span>
                <h3 className={styles.reviewCountNegative}>0</h3>
              </div>
            </div>
          </header>
          <hr className={styles.cardSeparator} />
          <footer className={styles.cardFooter}>
            <div className={styles.valuteInfo}>
              <h2 className={styles.valuteExchange}>
                <RoundValute value={card.in_count} />
                <div className={styles.valuteIcon}>
                  <img
                    src={card.icon_valute_from}
                    alt={`Иконка ${card.valute_from}`}
                    className={styles.valuteImage}
                  />
                </div>
                <i className={styles.arrowIcon}>
                  <ArrowRight />
                </i>
              </h2>
              <h2 className={styles.valuteExchange}>
                <RoundValute value={card.out_count} />
                <div className={styles.valuteIcon}>
                  <img
                    src={card.icon_valute_to}
                    alt={`Иконка ${card.valute_to}`}
                    className={styles.valuteImage}
                  />
                </div>
              </h2>
            </div>
            <span className={styles.valuteRange}>
              {t("Обмен")} <RoundValute value={card.min_amount} /> {t("до")}{" "}
              <RoundValute value={card.max_amount} />
            </span>
          </footer>
        </a>
      </animated.article>
    );
  }
);
