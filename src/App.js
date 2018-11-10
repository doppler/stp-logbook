import React, { Component } from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import "./App.css";
import StudentRouter from "./components/StudentRouter";

class App extends Component {
  render() {
    store.students = [];
    store.filteredStudents = [];
    store.filter = "";
    store.flash = store.flash || {};
    return (
      <div className="App">
        <Route exact path="/" component={StudentRouter} />
        <Route path="/student" component={StudentRouter} />
      </div>
    );
  }
}

export default App;

fetch("/api/instructors")
  .then(res => res.json())
  .then(json => {
    store.instructors = { list: json };
  });
