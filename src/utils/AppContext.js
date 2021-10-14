import React, { createContext, useReducer, useEffect } from "react";
import Web3 from "web3";
import Envirnment from "../utils/Environment";

import MarketABI from "../utils/MarketABI.json";
import SLAABI from "../utils/SLAABI.json";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

let initialState = {
  userWalletAddress: "",
  marketContract: null,
  slaContract: null,
  data: [],
  userData: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "WALLETADDRESS":
      return {
        ...state,
        userWalletAddress: payload,
      };
    case "MARKET_CONTRACT":
      return {
        ...state,
        marketContract: payload,
      };
    case "DATA":
      return {
        ...state,
        data: payload,
      };
    case "USERDATA":
      return {
        ...state,
        userData: payload,
      };
    case "SLA_CONTRACT":
      return {
        ...state,
        slaContract: payload,
      };
    case "SLA1_CONTRACT":
      return {
        ...state,
        sla1Contract: payload,
      };
    default:
      return state;
  }
};

export const AppContext = createContext(initialState);

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const disconnect = () => {
    dispatch({
      type: "WALLETADDRESS",
      payload: "",
    });
  };
  const dataget = async (account) => {
    // contract for mnp token
    const marketContract = await new web3.eth.Contract(
      MarketABI,
      Envirnment.marketAddress
    );
    const slaContract = await new web3.eth.Contract(
      SLAABI,
      Envirnment.sla1Address
    );

    if (account[0]) {
      dispatch({
        type: "WALLETADDRESS",
        payload: account[0],
      });

      var products = await marketContract.methods
        .getUserProducts(account[0])
        .call();
      var arr1 = [];
      for (let i = 0; i < products.length; i++) {
        if (+products[i] !== 0) {
          var produc = await marketContract.methods
            .YOURPRODUCTSUBCRIBED(products[i])
            .call();
          console.log(products[i], "products");
          arr1.push(produc);
        } else {
          break;
        }
      }
      dispatch({
        type: "USERDATA",
        payload: arr1,
      });
    }
    dispatch({
      type: "MARKET_CONTRACT",
      payload: marketContract,
    });

    var count = await marketContract.methods.productcount().call();

    if (count > 0) {
      var arr = [];
      for (let i = 0; i < count; i++) {
        var ids = await marketContract.methods.idds(i).call();
        var data = await marketContract.methods
          .getavailableproducts(ids)
          .call();
        console.log(data);
        var obj = {
          id: ids,
          name: data.name,
          memory: data.memoryCapacity,
          storage: data.storageCapacity,
          price1: data.pricePerMonth,
          price2: data.priceThreeMonth,
          paygo: data.payToGo,
          cpu: data.vCpu,
        };
        arr.push(obj);
      }
      dispatch({
        type: "DATA",
        payload: arr,
      });
    }

    dispatch({
      type: "SLA_CONTRACT",
      payload: slaContract,
    });
  };
  const ConnectToWallet = () => {
    Ethereum();
    async function Ethereum() {
      window.ethereum && window.ethereum.enable();
      if (typeof window.ethereum !== "undefined") {
        let connectAccount = setInterval(async () => {
          const account = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          dataget(account);
          clearInterval(connectAccount);
        }, 500);
      }
    }
  };
  const dataHandler = async () => {
    await state.stakingContract.methods
      .users(state.userWalletAddress)
      .call()
      .then((val) =>
        dispatch({
          type: "DATA",
          payload: val,
        })
      )
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    Ethereum();
    async function Ethereum() {
      // window.ethereum && window.ethereum.enable();
      if (typeof window.ethereum !== "undefined") {
        let connectAccount = setInterval(async () => {
          // const web3 = new Web3(Web3.givenProvider || "http://localhost8545");
          const account = await web3.eth.getAccounts();

          dataget(account);

          clearInterval(connectAccount);
        }, 500);
      }
    }
  }, []);

  React.useLayoutEffect(() => {}, []);

  let final;
  const Init = async () => {
    //
    try {
      Ethereum();
      async function Ethereum() {
        window.ethereum.on("accountsChanged", (accounts) => {
          final = Web3.utils.toChecksumAddress(accounts[0]);
          dataget(final);
        });
        // window.location.reload()
      }
    } catch (err) {}
  };

  React.useLayoutEffect(() => {
    Init();
  }, [final]);
  console.log(state);
  return (
    <AppContext.Provider
      value={{
        userWalletAddress: state.userWalletAddress,
        marketContract: state.marketContract,
        slaContract: state.slaContract,
        data: state.data,
        userData: state.userData,
        connectWalletFunction: ConnectToWallet,
        disconnect,
        dataHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
