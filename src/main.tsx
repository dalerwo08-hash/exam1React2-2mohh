import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider as ReduxProvider } from "react-redux";
import { Provider as JotaiProvider } from "jotai";

import { store } from "./component/reduxStore";
import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </ReduxProvider>
  </StrictMode>
);