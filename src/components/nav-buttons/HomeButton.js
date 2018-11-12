import React from "react";

const HomeButton = ({ key, onClick }) => (
  <button id={key} key={key} onClick={onClick}>
    Home
  </button>
);

export default HomeButton;
