import React from "react";
import { Route, Switch } from "react-router-dom";

import { store, collect } from "react-recollect";

import Header from "../Header";
import List from "./List";
import Show from "./Show";
import Edit from "./Edit";
import Jump from "./Jump";
import Footer from "../Footer";

store.students = [];
store.filteredStudents = [];
store.student = null;
store.instructors = [];
store.aircraft = [];
store.activeStudentRow = 0;

const StudentRouter = props => {
  const { headerButtons } = store;
  return (
    <React.Fragment>
      <Header buttons={headerButtons} />
      <Switch>
        <Route exact path="/students" component={List} />
        <Route path="/students/:studentId/jump/:jumpNumber" component={Jump} />
        <Route path="/students/:studentId/edit" component={Edit} />
        <Route path="/students/new" component={Edit} />
        <Route path="/students/:studentId" component={Show} />
      </Switch>
      <Footer />
    </React.Fragment>
  );
};

export default collect(StudentRouter);
