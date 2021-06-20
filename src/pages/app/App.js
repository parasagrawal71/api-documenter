import React from "react";

// IMPORT USER-DEFINED COMPONENTS HERE
import DocumentationPage from "pages/documentation/Documentation";
import Toast from "subComponents/toast/Toast";
import useGlobal from "redux/globalHook";

// IMPORT ASSETS HERE
import "./App.css";

const App = () => {
  const [globalState] = useGlobal();

  return (
    <main className="App">
      <Toast toastState={globalState?.toastState} />
      <DocumentationPage />
    </main>
  );
};

export default App;
