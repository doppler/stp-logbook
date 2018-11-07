import React from "react";
import { withRouter, Link } from "react-router-dom";

import "./Header.css";

const handleActionButtonClick = props => {
  props.history.push(`/student/new`);
};

const Header = props => {
  const { title } = props;
  return (
    <div className="Header">
      <div className="Nav">
        {props.location.pathname !== "/" ? (
          <button style={{ display: "block" }}>
            <Link to="/">Back</Link>
          </button>
        ) : null}
      </div>
      <div className="Title">
        <h1>{title}</h1>
      </div>
      <div className="Actions">
        {props.location.pathname === "/" ? (
          <button onClick={() => handleActionButtonClick(props)}>
            Add Student
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Header);
