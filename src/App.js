import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import Students from "./components/Students";
import Student from "./components/Student";

import fetchStudents from "./api/fetchStudents";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: []
    };
  }

  componentDidMount = async () => {
    const students = await fetchStudents();
    this.setState({ students });
  };

  render() {
    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={props => (
            <Students {...props} students={this.state.students} />
          )}
        />
        <Route path="/student/:id" component={Student} />
      </div>
    );
  }
}

export default App;
