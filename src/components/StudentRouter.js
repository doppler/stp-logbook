import React from "react";
import { Route, Switch } from "react-router-dom";
import Students from "./Students";
import Student from "./Student";
import EditStudent from "./EditStudent";
import Jump from "./Jump";

const StudentRouter = props => {
  return (
    <Switch>
      <Route exact path="/" component={Students} />
      <Route path="/student/:studentId/jump/:jumpNumber" component={Jump} />
      <Route path="/student/:studentId/edit" component={EditStudent} />
      <Route path="/student/new" component={EditStudent} />;
      <Route path="/student/:studentId" component={Student} />;
    </Switch>
  );
};

export default StudentRouter;
