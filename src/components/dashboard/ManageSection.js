import React from "react";

export default ({ history }) => (
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
