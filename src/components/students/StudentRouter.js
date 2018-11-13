import React from "react";
import { Route, Switch } from "react-router-dom";
import List from "./List";
import Show from "./Show";
import Edit from "./Edit";
import Jump from "./Jump";

const StudentRouter = props => {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route path="/students/:studentId/jump/:jumpNumber" component={Jump} />
      <Route path="/students/:studentId/edit" component={Edit} />
      <Route path="/students/new" component={Edit} />
      <Route path="/students/:studentId" component={Show} />
    </Switch>
  );
};

export default StudentRouter;
