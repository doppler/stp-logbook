import React from "react";

import "./Header.css";

export default props => {
  const { location, title, handleBackButtonClick } = props;
  console.log(props);
  return (
    <div className="Header">
      <div className="Nav">
        {location.pathname !== "/" ? (
          <button onClick={() => handleBackButtonClick()}>Back</button>
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
