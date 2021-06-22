import React from "react";
import { Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// IMPORT USER-DEFINED COMPONENTS HERE
import DocumentationPage from "pages/documentation/Documentation";
import Toast from "subComponents/toast/Toast";
import useGlobal from "redux/globalHook";
import history from "routes/history";
import Routes from "routes/Routes";
import ScrollToTop from "routes/ScrollToTop";

// IMPORT ASSETS HERE
import "./App.css";

const App = () => {
  const [globalState] = useGlobal();

  // Customize material ui theme
  const materialUiTheme = createMuiTheme({
    typography: {
      fontFamily: `"Poppins", sans-serif`,
    },
    palette: {
      primary: {
        main: "rgba(76, 82, 100, 0.9)",
      },
      secondary: {
        main: "rgba(220, 0, 78, 0.7)",
      },
    },
  });

  return (
    <Router history={history}>
      <MuiThemeProvider theme={materialUiTheme}>
        <main className="App">
          <Toast toastState={globalState?.toastState} />
          <ScrollToTop />
          <Routes />
        </main>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
