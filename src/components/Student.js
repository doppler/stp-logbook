import React, { Component } from "react";
// import { Link } from "react-router-dom";
import "./Student.css";

import Header from "./Header";
import Footer from "./Footer";

import fetchStudent from "../api/fetchStudent";

export default class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: undefined
    };
  }
  componentDidMount = async () => {
    const student = await fetchStudent(this.props.match.params.id);
    this.setState({ student });
  };

  render() {
    const { student } = this.state;
    if (!student) return null;
    return (
      <>
        <Header title={student.name} />
        <div className="Student">
          <table>
            <thead>
              <tr>
                <th>Jump #</th>
                <th>Dive Flow</th>
                <th>Date</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {student.jumps.map((jump, i) => (
                <tr key={i}>
                  <td>{jump.number}</td>
                  <td>{jump.diveFlow}</td>
                  <td>{jump.date}</td>
                  <td>{jump.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </>
    );
  }
}
