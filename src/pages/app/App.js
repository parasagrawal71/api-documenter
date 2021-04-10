import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import EndpointComponent from "components/endpoint/Endpoint";
import HeaderComponent from "components/header/Header";

// IMPORT ASSETS HERE
import "./App.css";

import endpoint from "./endpoint.json"; // TODO: REMOVE LATER

function App() {
  return (
    <main className="App">
      <HeaderComponent />
      <EndpointComponent endpoint={endpoint} />
    </main>
  );
}

export default App;
