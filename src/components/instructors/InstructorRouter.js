import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../Header";
import List from "./List";
import Edit from "./Edit";

const InstructorRouter = () => (
  <React.Fragment>
    <Header />
    <Switch>
      <Route exact path="/instructors" component={List} />
      <Route path="/instructors/new" component={Edit} />
      <Route path="/instructors/:id" component={Edit} />
    </Switch>
  </React.Fragment>
);

export default InstructorRouter;
