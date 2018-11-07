import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import EditStudent from "./components/EditStudent";
import Students from "./components/Students";
import Student from "./components/Student";
import Jump from "./components/Jump";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Students} />
          <Route path="/student/:studentId/jump/:jumpNumber" component={Jump} />
          <Route path="/student/new" component={EditStudent} />
          <Route path="/student/:id/edit" component={EditStudent} />
          <Route path="/student/:id" component={Student} />
        </Switch>
      </div>
    );
  }
}

export default App;
