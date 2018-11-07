import React from "react";
import { withRouter, Link } from "react-router-dom";

import "./Header.css";

const handleActionButtonClick = props => {
  props.history.push(`/student/new`);
};

const Header = props => {
  const { title, student, match } = props;
  return (
    <div className="Header">
      <div className="Nav">
        {match.path === "/student/:studentId/jump/:jumpNumber" ? (
          <button>
            <Link to={`/student/${match.params.studentId}`}>Jumps</Link>
          </button>
        ) : match.path !== "/" ? (
          <button style={{ display: "block" }}>
            <Link to="/">Home</Link>
          </button>
        ) : null}
      </div>
      <div className="Title">
        <h1>{title || student.name}</h1>
      </div>
      <div className="Actions">
        {match.path === "/" ? (
          <button onClick={() => handleActionButtonClick(props)}>
            Add Student
          </button>
        ) : match.path === "/student/:id" ? (
          <button style={{ display: "block" }}>
            <Link to={`/student/${student.id}/edit`}>Edit</Link>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Header);
// export default Header;

/*
<Link
  to={`/student/${student.id}/jump/${
    student.jumps[student.jumps.length].number
  }`}
/>
*/
