import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../Header";
import List from "./List";
import Edit from "./Edit";

const InstructorRouter = () => (
  <>
    <Header />
    <Switch>
      <Route path="/instructors/new" component={Edit} />
      <Route path="/instructors/:id" component={Edit} />
      <Route path="/instructors" component={List} />
    </Switch>
  </>
);

export default InstructorRouter;
