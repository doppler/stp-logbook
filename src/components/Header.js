import React from "react";
import { store, collect } from "react-recollect";
import { withRouter, Link } from "react-router-dom";

import "./Header.css";

const handleActionButtonClick = props => {
  props.history.push(`/student/new`);
};

const handleFilterChange = e => {
  const filter = e.target.value.toLowerCase();
  store.app.filteredStudents = store.app.students.filter(obj =>
    obj.name.toLowerCase().match(filter)
  );
  store.app.filter = e.target.value;
};

const Header = collect(
  withRouter(props => {
    const { match, filter } = store.app;
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
          ) : match.path === "/" ? (
            <input
              onChange={handleFilterChange}
              value={filter}
              placeholder="Filter by name"
            />
          ) : null}
        </div>
        <div className="Title">
          <h1>{store.app.header.title}</h1>
        </div>
        <div className="Actions">
          {match.path === "/" ? (
            <button onClick={() => handleActionButtonClick(props)}>
              Add Student
            </button>
          ) : match.path === "/student/:studentId" ? (
            <button style={{ display: "block" }}>
              <Link to={`/student/${match.params.studentId}/edit`}>Edit</Link>
            </button>
          ) : null}
        </div>
      </div>
    );
  })
);

export default collect(withRouter(Header));
