import React, { Component } from "react";
import "./App.css";

import Students from "./components/Students";
import Student from "./components/Student";

import fetchStudents from "./api/fetchStudents";

class App extends Component {
  constructor() {
    super();
    this.state = {
      page: "Students",
      students: null,
      student: null
    };
  }

  componentDidMount = async () => {
    const students = await fetchStudents();
    this.setState({ students });
  };

  handleStudentClick = _student => {
    const student = this.state.students.find(s => s.id === _student.id);
    this.setState({
      page: student.name,
      student
    });
  };

  render() {
    const mergedProps = {
      ...this.props,
      ...this.state,
      handleStudentClick: this.handleStudentClick
    };
    const { student } = mergedProps;
    let ContentComponent;
    switch (true) {
      case student !== null:
        ContentComponent = Student;
        break;
      default:
        ContentComponent = Students;
    }
    return (
      <div className="App">
        <div className="Header">
          <h1>{this.state.page}</h1>
        </div>
        <ContentComponent {...mergedProps} />
        <div className="Footer">
          <h1>Footer</h1>
        </div>
      </div>
    );
  }
}

export default App;
