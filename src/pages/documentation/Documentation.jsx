import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";
import HeaderComponent from "components/header/Header";
import TableOfContentsComponent from "components/tableOfContents/tableOfContents";

// IMPORT ASSETS HERE
import endpoints from "assets/endpoints.json"; // TODO: REMOVE LATER
import appStyles from "./Documentation.module.scss";

const Documentation = () => {
  return (
    <section className={appStyles["main-container"]}>
      <HeaderComponent />
      <section className={appStyles["content-cnt"]}>
        <section className={appStyles["table-of-contents"]}>
          <TableOfContentsComponent />
        </section>
        <section className={appStyles["endpoints-cnt"]}>
          {endpoints?.map((endpoint) => {
            return (
              <EndpointComponent endpoint={endpoint} key={endpoint?.title} />
            );
          })}
        </section>
      </section>
    </section>
  );
};

export default Documentation;
