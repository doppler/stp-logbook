import React, { useState, useEffect } from "react";
import "./Jump.css";

import Header from "./Header";
import Footer from "./Footer";

import fetchStudent from "../api/fetchStudent";

export default props => {
  const [student, setStudent] = useState();
  const [jump, setJump] = useState();

  useEffect(
    async () => {
      const { studentId, jumpNumber } = props.match.params;
      const student = await fetchStudent(studentId);
      setStudent(student);
      setJump(student.jumps.find(jump => (jump.number = Number(jumpNumber))));
    },
    [setStudent, setJump]
  );

  if (!student || !jump) return null;
  return (
    <>
      <Header title={student.name} />
      <div className="Jump">
        <h1>Jump {jump.number}</h1>
      </div>
      <Footer />
    </>
  );
};
