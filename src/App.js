import React, { Component } from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import "./App.css";
import DashboardRouter from "./components/dashboard/DashboardRouter";
import StudentRouter from "./components/students/StudentRouter";

class App extends Component {
  render() {
    store.students = [];
    store.filteredStudents = [];
    store.instructors = [];
    store.filter = "";
    store.flash = store.flash || {};
    store.headerButtons = [];
    store.deleteConfirmation = false;
    return (
      <div className="App">
        <Route exact path="/" component={DashboardRouter} />
        <Route path="/dashboard" component={DashboardRouter} />
        <Route path="/students" component={StudentRouter} />
      </div>
    );
  }
}

export default App;
