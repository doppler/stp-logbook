import React from "react";
import { useHistory } from "react-router-dom";

const ManageSection = () => {
  const history = useHistory();
  return (
    <section>
      <details>
        <summary>Manage Instructors and Aircraft</summary>
        <p>
          <button onClick={() => history.push("/instructors")}>
            Manage Instructors
          </button>
        </p>
        <p>
          <button onClick={() => history.push("/aircraft")}>
            Manage Aircraft
          </button>
        </p>
      </details>
    </section>
  );
};

export default ManageSection;
