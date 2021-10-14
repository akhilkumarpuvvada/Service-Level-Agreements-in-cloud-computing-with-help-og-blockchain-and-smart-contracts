import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import App from "../App";
import { AppContext } from "../utils/AppContext";

// import { ToastContainer} from 'react-toastify';
// import Maincomponent from '../components/mainComponent/mainComponent'
function Routes() {
  const { connectWalletFunction } = useContext(AppContext);

  // React.useEffect(() => {
  //   connectWalletFunction();
  // }, []);
  return (
    <BrowserRouter>
      <div id="main">
        {/* <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
        <Route exact path="/" component={App} />
      </div>
    </BrowserRouter>
  );
}
export default Routes;
