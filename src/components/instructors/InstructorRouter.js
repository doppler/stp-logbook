import React from "react";
import { Route, Switch } from "react-router-dom";

import { store, collect } from "react-recollect";

import Header from "../Header";
import List from "./List";
import Edit from "./Edit";
import Footer from "../Footer";

const InstructorRouter = props => {
  const { headerButtons } = store;
  return (
    <React.Fragment>
      <Header buttons={headerButtons} />
      <Switch>
        <Route exact path="/instructors" component={List} />
        <Route path="/instructors/new" component={Edit} />
        <Route path="/instructors/:id" component={Edit} />
      </Switch>
      <Footer />
    </React.Fragment>
  );
};

export default collect(InstructorRouter);
