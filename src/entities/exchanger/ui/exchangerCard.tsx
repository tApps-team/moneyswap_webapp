import { animated, useInView } from "react-spring";
import styles from "./exchangerCard.module.scss";
import { FC } from "react";
import { Exchanger } from "../model";
import { City } from "@/entities/location";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";
import { LogoArrow } from "@/shared/assets";
import { RoundValute } from "@/shared/ui";
import { Ban, CalendarDays, Check, Clock, Minus } from "lucide-react";

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

  const openReviews = () => {
    console.log("открыть отзывы");
  };
  return (
    <animated.article
      ref={ref}
      style={springs}
      className={`${styles.exchangerCard__container} ${
        card?.vip && styles.vip
      }`}
    >
      {card?.vip && (
        <div className={styles.vip_partner}>
          <p>{t("VIP-партнер")}</p>
        </div>
      )}
      <a
        onClick={() => openLink(card.partner_link)}
        rel="noopener noreferrer"
        className={`${styles.exchangerCard} ${card?.info && styles.partner}`}
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
            <div
              className={styles.reviewCountWrapper}
              onClick={(e) => {
                e.stopPropagation();
                openReviews();
              }}
            >
              <p className={styles.reviewTitle}>{t("Отзывы")}</p>
              <div className={styles.reviews}>
                <h3 className={styles.reviewCountPositive}>
                  {card?.review_count?.positive}
                </h3>
                <span className={styles.separator}></span>
                <h3 className={styles.reviewCountNegative}>
                  {card?.review_count?.neutral}
                </h3>
              </div>
            </div>
          </div>
        </header>
        {card?.info ? (
          <div className={styles.info}>
            <div className={styles.info__block}>
              <Clock width={12} height={12} />
              <div className="truncate flex items-center">
                <span>{card?.info?.time_from || "00:00"}</span>{" "}
                <Minus width={8} height={8} />{" "}
                <span>{card?.info?.time_to || "00:00"}</span>
              </div>
            </div>
            <div className={styles.info__block}>
              <CalendarDays width={12} height={12} />
              <div className={styles.days}>
                {Object.entries(card?.info?.working_days).map(
                  ([day, isWorking]) => {
                    if (isWorking)
                      return <span key={day}>{isWorking && t(`${day}`)}</span>;
                  }
                )}
              </div>
            </div>
            <div className={styles.info__block}>
              {card?.info?.delivery ? (
                <Check width={10} height={10} />
              ) : (
                <Ban width={10} height={10} />
              )}
              <p>{t("Доставка")}</p>
            </div>
            <div className={styles.info__block}>
              {card?.info?.office ? (
                <Check width={10} height={10} />
              ) : (
                <Ban width={10} height={10} />
              )}
              <p>{t("Офис")}</p>
            </div>
          </div>
        ) : (
          <hr className={styles.cardSeparator} />
        )}
        <footer className={styles.cardFooter}>
          <div className={styles.valuteInfo}>
            <h2 className={styles.valuteExchange}>
              <RoundValute value={card?.in_count} />
              {/* <div className={styles.valuteIcon}>
                <img
                  src={card?.icon_valute_from}
                  alt={`Иконка ${card?.valute_from}`}
                  className={styles.valuteImage}
                />
              </div> */}
              <p className="truncate ml-1 font-thin">{card?.valute_from}</p>
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
              {/* <div className={styles.valuteIcon}>
                <img
                  src={card?.icon_valute_to}
                  alt={`Иконка ${card?.valute_to}`}
                  className={styles.valuteImage}
                />
              </div> */}
              <p className="truncate ml-1 font-thin">{card?.valute_to}</p>
            </h2>
          </div>
          <span className={styles.valuteRange}>
            {t("Обмен от")}{" "}
            {card?.min_amount ? (
              <RoundValute value={card?.min_amount} />
            ) : (
              t("Amount_null")
            )}{" "}
            {t("до")}{" "}
            {card?.max_amount ? (
              <RoundValute value={card?.max_amount} />
            ) : (
              t("Amount_null")
            )}
          </span>
        </footer>
      </a>
    </animated.article>
  );
};
