import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../Header";
import List from "./List";
import Edit from "./Edit";

const AircraftRouter = () => (
  <>
    <Header />
    <Switch>
      <Route path="/aircraft/new" component={Edit} />
      <Route path="/aircraft/:id" component={Edit} />
      <Route path="/aircraft" component={List} />
    </Switch>
  </>
);

export default AircraftRouter;
