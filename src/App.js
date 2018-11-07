import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import EditStudent from "./components/EditStudent";
import Students from "./components/Students";
import Student from "./components/Student";
import Jump from "./components/Jump";

// import fetchStudents from "./api/fetchStudents";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     students: []
  //   };
  // }
  //
  // componentDidMount = async () => {
  //   const students = await fetchStudents();
  //   this.setState({ students });
  // };

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Students} />
        <Switch>
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
/*
<Route
  exact
  path="/"
  render={props => (
    <Students {...props} students={this.state.students} />
  )}
/>
*/
