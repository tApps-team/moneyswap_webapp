import ReactDOM from "react-dom/client";
import "@/shared/styles/globals.scss";
import "@/shared/config/i18n/i18n";
import * as Sentry from "@sentry/react";
import "./shared/styles/globals.scss";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";
import React from "react";
import App from "./app";

// Sentry.init({
//   dsn: "https://e04ca8c2735eaf9c3e52375fc2ace562@o4506694926336000.ingest.us.sentry.io/4506706862407680",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//     // Sentry.reactRouterV6BrowserTracingIntegration({
//     //   useEffect: React.useEffect,
//     //   useLocation,
//     //   useNavigationType,
//     //   createRoutesFromChildren,
//     //   matchRoutes,
//     // }),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 10 * 60 * 5, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: [
//     "localhost",
//     /https:\/\/api\.moneyswap\.online\/api/,
//   ],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
