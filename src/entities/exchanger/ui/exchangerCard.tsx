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
  ReviewSlot: React.ReactNode;
}

export const ExchangerCard: FC<ExchangerCardProps> = ({
  card,
  city,
  ReviewSlot,
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
  return (
    <animated.article
      ref={ref}
      style={springs}
      className={`${styles.exchangerCard__container} ${
        card?.is_vip && styles.vip
      }`}
    >
      {card?.is_vip && (
        <div className={styles.vip_partner}>
          <p>{t("VIP-партнер")}</p>
        </div>
      )}
      <a
        onClick={() => openLink(card?.partner_link)}
        rel="noopener noreferrer"
        className={`${styles.exchangerCard} ${
          card?.is_vip || card?.info ? styles.partner : ""
        }`}
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
            <div>{ReviewSlot}</div>
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
            <div className={styles.valuteExchange}>
              <RoundValute value={card?.in_count} />
              <p className="truncate ml-1 font-thin">{card?.valute_from}</p>
              <i className={styles.arrowIcon}>
                <LogoArrow
                  fill="#f6ff5f"
                  width={15}
                  height={15}
                  className="rotate-180"
                />
              </i>
            </div>
            <div className={`${styles.valuteExchange} overflow-hidden`}>
              <RoundValute value={card?.out_count} />
              <p className="truncate ml-1 font-thin">{card?.valute_to}</p>
            </div>
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
