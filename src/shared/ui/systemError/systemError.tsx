import { FC } from "react";
import styles from "./systemError.module.scss";
import { useTranslation } from "react-i18next";

interface SystemErrorProps {
  network?: boolean;
  direction?: boolean;
  response?: boolean;
}

export const SystemError: FC<SystemErrorProps> = ({ direction, response }) => {
  const { t } = useTranslation();
  return (
    <section className={styles.systemError}>
      <p className={styles.errorText}>
        {direction
          ? `${t("Выбранное направление недоступно")}`
          : response && `${t("Системная ошибка")}`}
      </p>
    </section>
  );
};
