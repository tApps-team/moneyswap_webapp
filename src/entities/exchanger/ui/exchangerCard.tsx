import { animated, useInView } from "react-spring";
import styles from "./exchangerCard.module.scss";
import { FC } from "react";
import { Exchanger } from "../model";
import { City } from "@/entities/location";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";
import { LogoArrow } from "@/shared/assets";
import { RoundValute } from "@/shared/ui";

interface ExchangerCardProps {
  card: Exchanger;
  city: City | null;
  openLink: (url: string) => void;
  openReviews?: () => void;
}

export const ExchangerCard: FC<ExchangerCardProps> = ({
  card,
  city,
  openLink,
  openReviews,
}) => {
  const { t, i18n } = useTranslation();
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
                {i18n.language === Lang.ru ? card?.name?.ru : card?.name?.en}
              </h2>
              <h3 className={styles.cityName}>
                {city
                  ? `${t("В г.")} ${
                      i18n.language === Lang.ru
                        ? city?.name?.ru
                        : city?.name?.en
                    }`
                  : t("Онлайн обмен")}
              </h3>
            </div>
            <div className={styles.reviewCountWrapper} onClick={openReviews}>
              <p className={styles.reviewTitle}>{t("Отзывы")}</p>
              <div className={styles.reviews}>
                <h3 className={styles.reviewCountPositive}>
                  {card?.review_count.positive}
                </h3>
                <span className={styles.separator}></span>
                <h3 className={styles.reviewCountNegative}>
                  {card.review_count.neutral}
                </h3>
              </div>
            </div>
          </div>
        </header>
        <hr className={styles.cardSeparator} />
        <footer className={styles.cardFooter}>
          <div className={styles.valuteInfo}>
            <h2 className={styles.valuteExchange}>
              <RoundValute value={card?.in_count} />
              <div className={styles.valuteIcon}>
                <img
                  src={card?.icon_valute_from}
                  alt={`Иконка ${card?.valute_from}`}
                  className={styles.valuteImage}
                />
              </div>
              <i className={styles.arrowIcon}>
                <LogoArrow
                  fill="#f6ff5f"
                  width={15}
                  height={15}
                  className="rotate-180"
                />
              </i>
            </h2>
            <h2 className={styles.valuteExchange}>
              <RoundValute value={card?.out_count} />
              <div className={styles.valuteIcon}>
                <img
                  src={card?.icon_valute_to}
                  alt={`Иконка ${card?.valute_to}`}
                  className={styles.valuteImage}
                />
              </div>
            </h2>
          </div>
          <span className={styles.valuteRange}>
            {t("Обмен от")} <RoundValute value={card?.min_amount} /> {t("до")}{" "}
            <RoundValute value={card?.max_amount} />
          </span>
        </footer>
      </a>
    </animated.article>
  );
};
