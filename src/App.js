import React, { Component } from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import "./App.css";
import Home from "./components/Home";
import StudentRouter from "./components/students/StudentRouter";
import InstructorRouter from "./components/instructors/InstructorRouter";
import AircraftRouter from "./components/aircraft/AircraftRouter";

class App extends Component {
  render() {
    store.flash = store.flash || {};
    store.headerButtons = [];
    store.deleteConfirmation = false;
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentRouter} />
        <Route path="/instructors" component={InstructorRouter} />
        <Route path="/aircraft" component={AircraftRouter} />
      </div>
    );
  }
}

export default App;
