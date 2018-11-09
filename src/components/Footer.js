import React from "react";

export default props => {
  const { buttons } = props;
  return (
    <div className="Footer">
      <div className="Nav">{buttons}</div>
    </div>
  );
};
