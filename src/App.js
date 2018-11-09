import React from "react";
import { Route } from "react-router-dom";
import { store } from "react-recollect";

import "./App.css";
import StudentRouter from "./components/StudentRouter";

const App = () => {
  store.students = [];
  store.filteredStudents = [];
  store.filter = "";
  return (
    <div className="App">
      <Route exact path="/" component={StudentRouter} />
      <Route path="/student" component={StudentRouter} />
    </div>
  );
};

export default App;

fetch("/api/instructors")
  .then(res => res.json())
  .then(json => {
    store.instructors = { list: json };
  });
