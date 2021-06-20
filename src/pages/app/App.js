import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// IMPORT USER-DEFINED COMPONENTS HERE
import DocumentationPage from "pages/documentation/Documentation";
import Toast from "subComponents/toast/Toast";
import useGlobal from "redux/globalHook";

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
    <main className="App">
      <MuiThemeProvider theme={materialUiTheme}>
        <Toast toastState={globalState?.toastState} />
        <DocumentationPage />
      </MuiThemeProvider>
    </main>
  );
};

export default App;
