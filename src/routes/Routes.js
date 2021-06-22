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
      <Route exact path="/" component={LoginPage} />
      <Route exact path="/dashboard" component={DashboardPage} isPrivate />
      <Route exact path="/documentation" component={DocumentationPage} isPrivate />
      <Route component={LoginPage} />
    </Switch>
  );
};

export default Routes;
