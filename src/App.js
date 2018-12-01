import React, { Component } from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import initializeDatabase from "./utils/initializeDatabase";

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import StudentRouter from "./components/students/StudentRouter";
import InstructorRouter from "./components/instructors/InstructorRouter";
import AircraftRouter from "./components/aircraft/AircraftRouter";

class App extends Component {
  componentDidMount() {
    initializeDatabase();
  }
  render() {
    store.flash = store.flash || {};
    store.deleteConfirmation = false;
    return (
      <div className="App">
        <Route exact path="/" component={Dashboard} />
        <Route path="/students" component={StudentRouter} />
        <Route path="/instructors" component={InstructorRouter} />
        <Route path="/aircraft" component={AircraftRouter} />
      </div>
    );
  }
}

export default App;
