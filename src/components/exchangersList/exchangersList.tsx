import { FC, memo } from "react";
import { useSelectsStore } from "../../store/store";
import styles from "./exchangersList.module.scss";
import { Exchanger } from "../../model/Exchanger";
import { ExchangerCard } from "../exchangerCard";
import { useTranslation } from "react-i18next";

interface ExchangersListProps {
  exchangers: Exchanger[];
}

export const ExchangersList: FC<ExchangersListProps> = memo(
  ({ exchangers }) => {
    const give = useSelectsStore((state) => state.giveSelect);
    const get = useSelectsStore((state) => state.getSelect);
    const { t } = useTranslation();
    return (
      <section className={styles.exchangersList}>
        <div className={styles.title}>
          {t("Лучшие курсы")} {give?.name} {t("на")} {get?.name}
        </div>
        <div className={styles.list}>
          {exchangers &&
            exchangers.map((card) => (
              <ExchangerCard key={card.id} card={card} />
            ))}
        </div>
      </section>
    );
  }
);
