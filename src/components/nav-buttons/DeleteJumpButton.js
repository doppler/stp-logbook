import React from "react";

const DeleteJumpButton = ({ key, onClick, deleteConfirmation }) => (
  <button
    id={key}
    key={key}
    onClick={onClick}
    className={`${deleteConfirmation ? "pending" : null}`}
  >
    Delete Jump
  </button>
);

export default DeleteJumpButton;
