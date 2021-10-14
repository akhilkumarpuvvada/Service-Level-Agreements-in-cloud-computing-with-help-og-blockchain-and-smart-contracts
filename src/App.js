import logo from "./logo.svg";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./App.css";
import { AppContext } from "./utils/AppContext";
import { Box, Container, Grid, TextField } from "@material-ui/core";



import Web3 from "web3";
import moment from "moment";
import Environment from "./utils/Environment";
import axios from "axios";
const web3 = new Web3(Web3.givenProvider || "http://localhost8545");

function App() {
  const {
    connectWalletFunction,
    userWalletAddress = "...",
    disconnect,
    slaContract,
    data,
    userData,
    marketContract,
  } = React.useContext(AppContext);
  const [open, setopen] = useState(false);
  const [open1, setopen1] = useState(false);
  const [open2, setopen2] = useState(false);
  const [amount, setamount] = useState("");
  const [sla, setsla] = useState(0);
  const [startTime, setstartTime] = useState(0);
  const [endTime, setendTime] = useState(0);
  const [customer, setcustomer] = useState("");
  const [customerCheckpoint, setcustomerCheckpoint] = useState(0);
  const [price, setprice] = useState(0);
  const [volume, setvolume] = useState(0);
  const [usage, setusage] = useState(0);
  const [countTime, setCountDateTime] = React.useState({
    time_days: 0,
    time_Hours: 0,
    time_Minusts: 0,
    time_seconds: 0,
  });
  const [countTime1, setCountDateTime1] = React.useState({
    time_days: 0,
    time_Hours: 0,
    time_Minusts: 0,
    time_seconds: 0,
  });

  const [Provider, setProvider] = useState("");
  const connect = async () => {
    connectWalletFunction();
  };

  React.useEffect(() => {
    const init = async () => {
      const SLA = await slaContract.methods.providesla2().call();
      
      const cTime = await slaContract.methods.contractcreationtime().call();
      const eTime = await slaContract.methods.contractendtime().call();
      const customer = await slaContract.methods.customer().call();
      const time = await slaContract.methods.nextautoclaim().call();

      const volume = await slaContract.methods.SLAPercentage().call();
      const usetime = await slaContract.methods.totalusedtime().call();
      setvolume(+volume / 100);
      var useTime = +usetime * 1000;
      const days = Math.floor(useTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (useTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minuts = Math.floor((useTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((useTime % (1000 * 60)) / 1000);
      setCountDateTime1({
        ...countTime1,
        time_days: days,
        time_Hours: hours,
        time_Minusts: minuts,
        time_seconds: seconds,
      });
      // const volume = await slaContract.methods.requestVolumeData();
      // const volume1 = await slaContract.methods
      //   .calimforCustomer()
      //   .send({ from: userWalletAddress });
      const customerCPoint = await slaContract.methods
        .customercheckpoint()
        .call();

      const price = await slaContract.methods.price().call();
      const provider = await slaContract.methods.provider().call();
      setsla(SLA);
      setstartTime(cTime);
      setendTime(eTime);
      setcustomer(customer);
      setcustomerCheckpoint(customerCPoint);
      setprice(web3.utils.fromWei(price));
      setProvider(provider);
    };
    if (slaContract) {
      init();
    }
  }, [slaContract]);
  const DepositeHandler = async () => {
    if (!amount) {
      toast.error("Error! Please enter amount to go");
    } else if (isNaN(amount) || amount < 0) {
      toast.error("Error! Please enter valid amount to go");
    } else {
      slaContract.methods
        .depositforproviderer()
        .send({ from: userWalletAddress, value: amount })
        .then(() => toast.success("Success! Transaction Confirmed."))
        .catch((e) => toast.error(e.message));
    }
  };
  const ClaimHandler = async () => {
    slaContract.methods
      .calimforCustomer()
      .send({ from: userWalletAddress })
      .then(() => toast.success("Success! Transaction Confirmed."))
      .catch((e) => toast.error(e.message));
  };
  const registerHandler = async () => {
    marketContract.methods
      .Register()
      .send({ from: userWalletAddress })
      .then(() => toast.success("Success! you are successfuly registerd."))
      .catch((e) => toast.error(e.message));
  };

  let interval = React.useRef();
  const contStartTimerStart = (endTime) => {
    let countDownDate = moment.unix(endTime).format("x");

    const interval = setInterval(async () => {
      const now = new Date().getTime();
      const distance = +countDownDate - +now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minuts = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        setCountDateTime({
          ...countTime,
          time_days: days,
          time_Hours: hours,
          time_Minusts: minuts,
          time_seconds: seconds,
        });
      }
    }, 1000);
  };

  React.useEffect(() => {
    if (endTime) {
      contStartTimerStart(endTime);
    }
  }, [endTime]);
  return (
    <div class="body_04">
      {/* Preloader */}
      {/* <div id="loader-wrapper">
        <div id="loader" />
        <div className="loader-section section-left" />
        <div className="loader-section section-right" />
      </div> */}
      <header id="header-04" className="header">
        {/* START NAVBAR */}
        <nav
          className="navbar navbar-expand-md navbar-light bg-faded cripto_nav"
          style={{
            left: "0px",
            right: "0px",
            position: "fixed",
            top: "0px",
            width: "100% !important",
            zIndex: 99999,
          }}
        >
          <div className="container">
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars" />
            </button>
            <a className="navbar-brand" href="/">
              <img className="the_logo" src="images/m_logo.png" alt="logo" />
            </a>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a data-scroll href="#Home" className="nav-link active">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a data-scroll href="#SLA" className="nav-link active">
                    SLA
                  </a>
                </li>
                <li className="nav-item">
                  <a data-scroll href="#register" className="nav-link">
                    Register
                  </a>
                </li>

                <li className="nav-item">
                  <a data-scroll href="#your-products" className="nav-link">
                    Your Services
                  </a>
                </li>
                {Environment.defaultAddress.toLowerCase() ==
                  userWalletAddress.toLowerCase() && (
                  <li className="nav-item">
                    <a
                      data-scroll
                      href="#benefit-04"
                      href="#add-products"
                      className="nav-link"
                    >
                      Add Services
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    data-scroll
                    href="#benefit-04"
                    href="#all-products"
                    className="nav-link"
                  >
                    All Services
                  </a>
                </li>

                <li
                  className="nav-item intro-text"
                  style={{ marginTop: "-18px" }}
                >
                  {userWalletAddress ? (
                    <button
                      style={{ marginRight: 15 }}
                      onClick={() => disconnect()}
                      className="btn btn-default btn-default-style"
                    >
                      {userWalletAddress.slice(0, 6) +
                        "..." +
                        userWalletAddress.slice(-4)}
                    </button>
                  ) : (
                    <button
                      style={{ marginRight: 15 }}
                      // onClick={() => connectWalletFunction()}
                      onClick={() => connect()}
                      className="btn btn-default btn-default-style"
                    >
                      Connect
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* END NAVBAR */}
        <Box
          component="h3"
          id="Home"
          align="center"
          style={{ color: "#fff" }}
          fontSize={40}
          my={10}
          fontWeight={700}
        >
          Home
        </Box>
        <Container maxWidth="md">
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            fontSize={22}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Cloud  Contract</Box>
            <Box position="absolute" left="30%">
              :
            </Box>
            <Box>{Environment.marketAddress}</Box>
          </Box>

          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            fontSize={22}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>SLA  Contract</Box>
            <Box position="absolute" left="30%">
              :
            </Box>
            <Box>{Environment.sla1Address}</Box>
          </Box>
        </Container>
        <Box
          component="h3"
          id="SLA"
          align="center"
          style={{ color: "#fff" }}
          fontSize={40}
          my={10}
          fontWeight={700}
        >
          SLA
        </Box>
        <Container maxWidth="md">
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
            position="relative"
          >
            <Box>Status of cloud service</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box>{sla}</Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Availability</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box>{volume}%</Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Total downTime</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box>
              {countTime1.time_days}D:{countTime1.time_Hours}H:
              {countTime1.time_Minusts}M:{countTime1.time_seconds}S
            </Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            
            <Box>Customer Address</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box> {customer.slice(0, 6) + "..." + customer.slice(-4)}</Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Last claimed compensation</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box> {moment.unix(customerCheckpoint).format("LLL")}</Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Price</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box> {price} ETH</Box>
          </Box>
          <Box
            component="h3"
            align="center"
            display="flex"
            style={{ color: "#fff" }}
            justifyContent="space-between"
            my={3}
            position="relative"
          >
            <Box>Provider Address</Box>
            <Box position="absolute" left="50%">
              :
            </Box>
            <Box> {Provider.slice(0, 6) + "..." + Provider.slice(-4)}</Box>
          </Box>
        </Container>
       
       
        <Box
          component="h3"
          align="center"
          style={{ color: "#fff" }}
          fontSize={40}
          my={2}
          fontWeight={700}
        >
          Claim For Customer
        </Box>{" "}
        <Box
          component="h3"
          align="center"
          style={{ color: "#fff" }}
          fontSize={15}
          fontWeight={700}
        >
          <button
            style={{
              background: "#ff7050",
              borderRadius: "5px",
              fontWeight: 600,
              fontSize: "16px",
              color: "#ffffff",
              // height: "30px",
              lineHeight: "40px",
              padding: "5px 20px",
              textTransform: "uppercase",
              position: "relative",
              cursor: "pointer",
              border: "none",
            }}
            onClick={ClaimHandler}
          >
            Claim
          </button>
        </Box>
        <Box
          id="register"
          component="h3"
          align="center"
          style={{ color: "#fff" }}
          fontSize={40}
          my={2}
          fontWeight={700}
        >
          Register Yourself
        </Box>{" "}
        <Box
          component="h3"
          align="center"
          style={{ color: "#fff" }}
          fontSize={15}
          fontWeight={700}
        >
          <button
            style={{
              background: "#ff7050",
              borderRadius: "5px",
              fontWeight: 600,
              fontSize: "16px",
              color: "#ffffff",
              // height: "30px",
              lineHeight: "40px",
              padding: "5px 20px",
              textTransform: "uppercase",
              position: "relative",
              cursor: "pointer",
              border: "none",
            }}
            onClick={registerHandler}
          >
            Register
          </button>
        </Box>
        <div className="header_effect">
          <span className="running_effect running_effect1" />
          <span className="running_effect running_effect2" />
          <span className="running_effect running_effect3" />
          <span className="running_effect running_effect4" />
        </div>
      </header>{" "}
      {/* End Header */}
      <Box
        style={{
          background: "linear-gradient(to bottom, #7422a8 0%, #2c095c 100%)",
          marginTop: -80,
        }}
        pt={2}
      >
        <Box
          component="h3"
          align="center"
          style={{ color: "#fff" }}
          fontSize={15}
          fontWeight={700}
        >
          <button
            style={{
              background: "#ff7050",
              borderRadius: "5px",
              fontWeight: 600,
              fontSize: "16px",
              color: "#ffffff",
              // height: "30px",
              lineHeight: "40px",
              padding: "5px 20px",
              textTransform: "uppercase",
              position: "relative",
              cursor: "pointer",
              border: "none",
            }}
            onClick={ClaimHandler}
          >
            Claim
          </button>
        </Box>
        <Container maxWidth="lg">
          {Environment.defaultAddress.toLowerCase() ==
            userWalletAddress.toLowerCase() && (
            <>
              {" "}
              <Box
                component="h3"
                id="add-products"
                align="center"
                style={{ color: "#fff" }}
                fontSize={40}
                my={10}
                fontWeight={700}
              >
                Add Services
              </Box>
              <AddProductModal open={open2} setOpen={setopen2} />
              <Box
                component="h3"
                align="center"
                style={{ color: "#fff" }}
                fontSize={15}
                fontWeight={700}
              >
                <button
                  style={{
                    background: "#ff7050",
                    borderRadius: "5px",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#ffffff",
                    // height: "30px",
                    lineHeight: "40px",
                    padding: "5px 20px",
                    textTransform: "uppercase",
                    position: "relative",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() => setopen2(true)}
                >
                  Add Service
                </button>
              </Box>
            </>
          )}
          <Box
            component="h3"
            id="your-products"
            align="center"
            style={{ color: "#fff" }}
            fontSize={40}
            my={10}
            fontWeight={700}
          >
            Your Services
          </Box>
          <Grid container spacing={3}>
            {userData.length == 0 ? (
              <Grid item xs={12} md={12}>
                <Box
                  component="h3"
                  align="center"
                  style={{ color: "#fff" }}
                  fontSize={30}
                  my={10}
                  fontWeight={700}
                >
                  You have no subscribed Services yet
                </Box>
              </Grid>
            ) : (
              userData.map(
                (
                  { duration, operatingSystem, pricePerMonth, vCpus },
                  index
                ) => (
                  <Grid item xs={12} md={4}>
                    <Box border="1px solid #fff" p={3} borderRadius="5px">
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        my={1}
                        fontWeight={700}
                      >
                        Services {index + 1}
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={3}
                        my={2}
                      >
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={15}
                          fontWeight={700}
                        >
                          OS
                        </Box>
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={20}
                          fontWeight={700}
                        >
                          {operatingSystem}
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={3}
                        my={2}
                      >
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={15}
                          fontWeight={700}
                        >
                          Price
                        </Box>
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={20}
                          fontWeight={700}
                        >
                          {pricePerMonth}
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={3}
                        my={2}
                      >
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={15}
                          fontWeight={700}
                        >
                          Period
                        </Box>
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={20}
                          fontWeight={700}
                        >
                          {duration}
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={3}
                        my={2}
                      >
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={15}
                          fontWeight={700}
                        >
                          CPU
                        </Box>
                        <Box
                          component="h3"
                          align="center"
                          style={{ color: "#fff" }}
                          fontSize={20}
                          fontWeight={700}
                        >
                          {vCpus} GHz
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )
              )
            )}
          </Grid>
        </Container>
        <Container maxWidth="lg">
          <Box
            component="h3"
            align="center"
            id="all-products"
            style={{ color: "#fff" }}
            fontSize={40}
            my={10}
            fontWeight={700}
          >
            All Services
          </Box>

          <Grid container spacing={3}>
            {data.map(
              (
                { id, name, memory, storage, price1, price2, paygo, cpu },
                index
              ) => (
                <Grid item xs={12} md={4}>
                  <Modal
                    open={open}
                    one={price1}
                    id={id}
                    three={price2}
                    setOpen={setopen}
                  />
                  <PayModal
                    open={open1}
                    paygo={paygo}
                    id={id}
                    setOpen={setopen1}
                  />
                  <Box border="1px solid #fff" p={3} borderRadius="5px">
                    <Box
                      component="h3"
                      align="center"
                      style={{ color: "#fff" }}
                      fontSize={20}
                      my={1}
                      fontWeight={700}
                    >
                      Service {index + 1}
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        ID
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        fontWeight={700}
                      >
                        {id}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        Name
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        fontWeight={700}
                      >
                        {name}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        Memory
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        fontWeight={700}
                      >
                        {memory} GB
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        Storage
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        fontWeight={700}
                      >
                        {storage} GB
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        CPU
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={20}
                        fontWeight={700}
                      >
                        {cpu}GHz
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      my={2}
                    >
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        <button
                          style={{
                            background: "#ff7050",
                            borderRadius: "5px",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#ffffff",
                            // height: "30px",
                            lineHeight: "40px",
                            padding: "5px 20px",
                            textTransform: "uppercase",
                            position: "relative",
                            cursor: "pointer",
                            border: "none",
                          }}
                          onClick={() => setopen(true)}
                        >
                          Subscribe
                        </button>
                      </Box>
                      <Box
                        component="h3"
                        align="center"
                        style={{ color: "#fff" }}
                        fontSize={15}
                        fontWeight={700}
                      >
                        <button
                          style={{
                            background: "#ff7050",
                            borderRadius: "5px",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#ffffff",
                            // height: "30px",
                            lineHeight: "40px",
                            padding: "5px 20px",
                            textTransform: "uppercase",
                            position: "relative",
                            cursor: "pointer",
                            border: "none",
                          }}
                          onClick={() => setopen1(true)}
                        >
                          Pay as you go
                        </button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default App;
