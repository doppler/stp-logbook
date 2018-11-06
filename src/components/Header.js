import React from "react";
import { withRouter } from "react-router-dom";

import "./Header.css";

const Header = props => {
  const { title } = props;
  return (
    <div className="Header">
      <div className="Nav">
        {props.location.pathname !== "/" ? (
          <button onClick={() => props.history.goBack()}>Back</button>
        ) : null}
      </div>
      <div className="Title">
        <h1>{title}</h1>
      </div>
      <div className="Actions">
        <button>Action</button>
      </div>
    </div>
  );
};

export default withRouter(Header);
