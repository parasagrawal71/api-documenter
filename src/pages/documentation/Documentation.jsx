import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";
import HeaderComponent from "components/header/Header";

// IMPORT ASSETS HERE
import endpoint from "assets/endpoint.json"; // TODO: REMOVE LATER
import appStyles from "./Documentation.module.scss";

const Documentation = () => {
  return (
    <section className={appStyles["main-container"]}>
      <HeaderComponent />
      <EndpointComponent endpoint={endpoint} />
    </section>
  );
};

export default Documentation;
