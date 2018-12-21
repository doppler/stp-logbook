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
        <Route exact path="/" component={Dashboard} />
        <Route path="/students" component={StudentRouter} />
        <Route path="/instructors" component={InstructorRouter} />
        <Route path="/aircraft" component={AircraftRouter} />
      </div>
    </Router>
  );
};

export default App;
