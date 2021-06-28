import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// IMPORT USER-DEFINED COMPONENTS HERE
import Toast from "subComponents/toast/Toast";
import useGlobal from "redux/globalHook";
import history from "routes/history";
import Routes from "routes/Routes";
import ScrollToTop from "routes/ScrollToTop";
import { fetchLoggedInUserData } from "apis/apiCalls";

// IMPORT ASSETS HERE
import "./App.css";

const App = (props) => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    fetchLoggedInUserData().then((userData) => {
      globalActions.updateLoggedInUser(userData);
    });

    // eslint-disable-next-line
  }, []);

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
    <main className="App">
      <MuiThemeProvider theme={materialUiTheme}>
        <Router history={history}>
          <Toast toastState={globalState?.toastState} />
          <ScrollToTop />
          <Routes />
        </Router>
      </MuiThemeProvider>
    </main>
  );
};

export default App;
