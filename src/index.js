import React from "react";
import ReactDOM from "react-dom";

import App from "./routes/routes";
import { AppContextProvider } from "./utils/AppContext";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.render(
  <>
    <ToastContainer />
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
