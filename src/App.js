import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import initializeDatabase from "./utils/initializeDatabase";

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import StudentRouter from "./components/students/StudentRouter";
import InstructorRouter from "./components/instructors/InstructorRouter";
import AircraftRouter from "./components/aircraft/AircraftRouter";

const App = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);
  return (
    <Router>
      <div className="App">
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/instructors" component={InstructorRouter} />
        <Route path="/aircraft" component={AircraftRouter} />
        <Route path="/students" component={StudentRouter} />
        <Route exact path="/" component={StudentRouter} />
      </div>
    </Router>
  );
};

export default App;
