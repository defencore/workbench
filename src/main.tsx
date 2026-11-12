import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeOffline } from "./offline";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
if (document.readyState === "complete") void initializeOffline();
else window.addEventListener("load", initializeOffline, { once: true });
