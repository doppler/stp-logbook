import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import StudentRouter from "./components/StudentRouter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={StudentRouter} />
        <Route path="/student" component={StudentRouter} />
      </div>
    );
  }
}

export default App;
