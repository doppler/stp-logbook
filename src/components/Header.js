import React from "react";

export default ({ page, handleBackButtonClick }) => {
  return (
    <div className="Header">
      <div className="Nav">
        <nav>
          <button onClick={handleBackButtonClick}>Back</button>
        </nav>
      </div>
      <div className="pageTitle">
        <h1>{page}</h1>
      </div>
    </div>
  );
};
