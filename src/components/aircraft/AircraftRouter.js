import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../Header";
import List from "./List";
import Edit from "./Edit";

const AircraftRouter = () => (
  <React.Fragment>
    <Header />
    <Switch>
      <Route exact path="/aircraft" component={List} />
      <Route path="/aircraft/new" component={Edit} />
      <Route path="/aircraft/:id" component={Edit} />
    </Switch>
  </React.Fragment>
);

export default AircraftRouter;
