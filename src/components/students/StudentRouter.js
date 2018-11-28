import React from "react";
import { Route, Switch } from "react-router-dom";

import { store, collect } from "react-recollect";

import Header from "../Header";
import List from "./List";
import Show from "./Show";
import Edit from "./Edit";
import Jump from "./Jump";

store.student = null;
store.filteredStudents = [];
store.instructors = [];
store.aircraft = [];
store.activeStudentRow = 0;

const StudentRouter = props => {
  store.students = [];
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default collect(StudentRouter);
