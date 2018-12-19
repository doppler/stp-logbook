import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../Header";
import List from "./List";
import Show from "./Show";
import Edit from "./Edit";
import Jump from "./Jump";

const StudentRouter = () => (
  <>
    <Header />
    <div className="Content">
      <Switch>
        <Route exact path="/students" component={List} />
        <Route path="/students/:studentId/jump/:jumpId" component={Jump} />
        <Route path="/students/:studentId/edit" component={Edit} />
        <Route path="/students/new" component={Edit} />
        <Route path="/students/:studentId" component={Show} />
      </Switch>
    </div>
  </>
);

export default StudentRouter;
