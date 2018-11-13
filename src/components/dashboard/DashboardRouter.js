import React from "react";
import { Route, Switch } from "react-router-dom";

import { store, collect } from "react-recollect";

import Header from "../Header";
import Home from "./Home";
import Instructors from "./Instructors";
import Footer from "../Footer";

const DashboardRouter = props => {
  const { headerButtons } = store;
  return (
    <React.Fragment>
      <Header buttons={headerButtons} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard/instructors" component={Instructors} />
      </Switch>
      <Footer />
    </React.Fragment>
  );
};

export default collect(DashboardRouter);
