import styles from "./notFoundPage.module.scss";

export const NotFoundPage = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className={styles.container}></div>
      <section className={styles.systemError}>
        <img src="/img/notfound.gif" />
        <p className={styles.errorText}>Oops! Page not found - 404</p>
      </section>
    </div>
  );
};
