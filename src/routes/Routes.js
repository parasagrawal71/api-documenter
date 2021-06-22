import React from "react";
import { Switch } from "react-router-dom";

// IMPORT ALL PAGES HERE //
import LoginPage from "pages/login/Login";
import DashboardPage from "pages/dashboard/Dashboard";
import DocumentationPage from "pages/documentation/Documentation";

// IMPORT OTHERS HERE //
import Route from "./RouteWrapper";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={LoginPage} />
      <Route path="/dashboard" exact component={DashboardPage} isPrivate />
      <Route path="/documentation" exact component={DocumentationPage} isPrivate />
      <Route component={LoginPage} />
    </Switch>
  );
};

export default Routes;
