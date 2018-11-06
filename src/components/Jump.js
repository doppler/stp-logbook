import React, { Component } from "react";

import "./Jump.css";

import Header from "./Header";
import Footer from "./Footer";

import fetchStudent from "../api/fetchStudent";

export default class Jump extends Component {
  constructor(props) {
    super(props);
    this.state = { student: undefined, jump: undefined };
  }

  componentDidMount = async () => {
    const { studentId, jumpNumber } = this.props.match.params;
    const student = await fetchStudent(studentId);
    const jump = student.jumps.find(jump => jump.number === Number(jumpNumber));
    this.setState({ student, jump });
  };

  render() {
    const { student, jump } = this.state;
    if (!student) return null;
    return (
      <>
        <Header title={student.name} />
        <div className="Jump">
          <h1>Jump {jump.number}</h1>
        </div>
        <Footer />
      </>
    );
  }
}
