import React, { Component } from "react";
import "./App.css";

import Students from "./components/Students";

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

  handleStudentClick = student => {
    console.log(student);
    this.setState({
      student: this.state.students.find(s => s.id === student.id)
    });
  };

  render() {
    return (
      <div className="App">
        <div className="Header">
          <h1>{this.state.page}</h1>
        </div>
        <Students
          students={this.state.students}
          handleStudentClick={this.handleStudentClick}
        />
        <div className="Footer">
          <h1>Footer</h1>
        </div>
      </div>
    );
  }
}

export default App;
