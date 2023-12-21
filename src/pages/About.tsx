import { memo } from "react";

export const AboutPage = memo(() => {
  return (
    <div data-testid="about-page" className="page__wrapper">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90dvh",
        }}
      >
        ABOUT PAGE
      </h1>
    </div>
  );
});
