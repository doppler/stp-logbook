import React from "react";
import { store, collect } from "react-recollect";

const Home = ({ history }) => {
  if (store.headerButtons.length === 0)
    store.headerButtons = [
      {
        id: "l",
        onClick: () => history.push("/students"),
        children: "Log Book"
      },
      {
        id: "i",
        onClick: () => history.push("/dashboard/instructors"),
        children: "Instructors"
      },
      {
        id: "a",
        onClick: () => history.push("/dashboard/aircraft"),
        children: "Aircraft"
      }
    ];

  return <div className="Content">Home</div>;
};

export default collect(Home);
