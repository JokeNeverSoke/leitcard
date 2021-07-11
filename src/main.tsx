import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Offline } from "@sentry/integrations";
import { registerSW } from "virtual:pwa-register";

Sentry.init({
  dsn:
    "https://4c2b2dd8c6444efe83c6a289968fb5c0@o576762.ingest.sentry.io/5858154",
  integrations: [new Integrations.BrowserTracing(), new Offline()],
  release: process.env.COMMIT_SHA,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
});

import "./index.css";
import { store } from "./store";
import App from "./App";

registerSW();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
