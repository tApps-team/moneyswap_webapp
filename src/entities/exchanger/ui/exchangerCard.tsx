import { animated, useInView } from "react-spring";
import { FC } from "react";
import { City } from "@/entities/location";
import { useTranslation } from "react-i18next";
import { Lang } from "@/shared/config";
import { LogoArrow } from "@/shared/assets";
import { RoundValute } from "@/shared/ui";
import { Ban, CalendarDays, Check, Clock, Minus } from "lucide-react";
import { useAppSelector } from "@/shared/hooks";
import {
  useIncreaseLinkCountMutation,
} from "@/entities/user";
import { Exchanger } from "../model";
import { ExchangeRates, AMLTooltip } from "./components";
import styles from "./exchangerCard.module.scss";
import { normalizeRate } from "./functions";

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

  //user info
  const { user_id } = useAppSelector((state) => state.user);
  const [increaseLinkCount] = useIncreaseLinkCountMutation();

  const handleClick = (exchanger: Exchanger) => {
    openLink(exchanger?.partner_link);
    if (user_id) {
      const increaseincreaseLinkCountReq = {
        user_id,
        exchange_id: exchanger?.exchange_id,
        exchange_direction_id: exchanger?.exchange_direction_id,
        direction_marker: exchanger?.direction_marker,
      };
      increaseLinkCount(increaseincreaseLinkCountReq);
    }
  };

  const currentDay = new Date().getDay();

  // Проверяем, является ли текущий день будним или выходным
  const isWeekday = currentDay >= 1 && currentDay <= 5; // Пн-Пт

  const isBankomats =
    (card.info?.bankomats && card?.info?.bankomats.length > 0) ||
    false;

  return (
    <animated.article
      ref={ref}
      style={springs}
      className={`${styles.exchangerCard__container}`}
    >
      {card?.is_vip && (
        <div className={styles.vip_partner}>
          {t("Лучшее")} {t("предложение")}
        </div>
      )}
      <a
        onClick={() => handleClick(card)}
        rel="noopener noreferrer"
        className={`${styles.exchangerCard} ${card?.is_vip && styles.vip}`}
      >
        <header className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <div className={styles.exchangerInfo}>
              <div className="flex items-center gap-3 truncate min-w-0 w-full justify-between">
                <h2 className={styles.cardName}>
                {i18n.language === Lang.ru ? card?.name?.ru : card?.name?.en}
                </h2>
                <AMLTooltip isHighRisk={card?.info?.high_aml ?? false} />
              </div>
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
            <div className={styles.reviewSlot}>{ReviewSlot}</div>
          </div>
        </header>
          {(card?.info?.office || card?.info?.delivery || card?.info?.weekdays || card?.info?.weekends || card?.info?.working_days) ? (
            <div className={styles.info}>
              {(card?.info?.weekdays || card?.info?.weekends) && (
                <div className={styles.info__block}>
                  <Clock width={12} height={12} />
                  <div className="truncate flex items-center mt-[1px]">
                    <span className="leading-none">
                      {isWeekday
                        ? card?.info?.weekdays?.time_from
                        : card?.info?.weekends?.time_from || "00:00"}
                    </span>
                    <div className="flex justify-center items-center">
                      <Minus width={8} height={8} />
                    </div>
                    <span className="leading-none">
                      {isWeekday
                        ? card?.info?.weekdays?.time_to
                        : card?.info?.weekends?.time_to || "00:00"}
                    </span>
                  </div>
                </div>
              )}
              {card?.info?.working_days && (
                <div className={styles.info__block}>
                  <CalendarDays width={12} height={12} />
                  <div className={styles.days}>
                    {Object.entries(card?.info?.working_days).map(
                      ([day, isWorking]) => {
                        if (isWorking) return <span key={day}>{isWorking && t(`${day}`)}</span>;
                      }
                    )}
                  </div>
                </div>
              )}
              {card?.info?.delivery && (
                <div className={styles.info__block}>
                  {card?.info?.delivery ? (
                    <Check width={10} height={10} />
                  ) : (
                    <Ban width={10} height={10} />
                  )}
                  <p>{t("Доставка")}</p>
                </div>
              )}
              {card?.info?.office && (
                <div className={styles.info__block}>
                  {card?.info?.office ? (
                    <Check width={10} height={10} />
                  ) : (
                    <Ban width={10} height={10} />
                  )}
                  <p>{t("Офис")}</p>
                </div>
              )}
            </div>
          ) : (
            <hr className={styles.cardSeparator} />
          )}
        <footer className={`${styles.cardFooter} relative`}>
          {(() => {
            const { in_count, out_count } = normalizeRate(card.in_count, card.out_count);
            return (
              <div className={styles.valuteInfo}>
                <div className={styles.valuteExchange}>
                  <RoundValute value={in_count} />
                  <p className={`${styles.valuteName} truncate max-w-[18vw]`}>
                    {card?.valute_from}
                  </p>
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
                  <RoundValute value={out_count} />
                  <p
                    className={`${styles.valuteName} ${
                      isBankomats && "truncate max-w-[16vw]"
                    }`}
                  >
                    {card?.valute_to}
                  </p>
                </div>
              </div>
            );
          })()}
          <span className={styles.valuteRange}>
            {t("от")}{" "}
            <RoundValute value={card?.min_amount ?? 0} />
            {/* {card?.exchange_marker === ExchangerMarker.partner && "$"}{" "} */}
            {t("до")}{" "}
            {card?.max_amount ? (
              <>
                <RoundValute value={card?.max_amount} />
                {/* {card?.exchange_marker === ExchangerMarker.partner && "$"} */}
              </>
            ) : (
              t("Amount_null")
            )}
          </span>
          {isBankomats && (
            <div className="mobile:mt-1 mt-0.5 absolute top-0 right-0 justify-start flex flex-wrap flex-row gap-x-1 gap-y-0.5 w-[96px]">
              {card?.info?.bankomats?.map((bank) => (
                <div
                  key={bank?.id}
                  className="rounded-full overflow-hidden w-4 h-4 flex-shrink-0 cursor-pointer"
                >
                  <img src={bank?.icon} alt="icon" className="w-4 h-4" />
                </div>
              ))}
            </div>
          )}
          {card?.exchange_rates && (
            <ExchangeRates
              rates={card?.exchange_rates}
              valuteFrom={card?.valute_from}
              valuteTo={card?.valute_to}
            />
          )}
        </footer>
      </a>
    </animated.article>
  );
};
