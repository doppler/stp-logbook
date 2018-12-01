import React from "react";
import { store } from "react-recollect";
import DB from "../../DB";
import createTestData from "../../utils/createTestData";

DB.find({ selector: { type: "aircraft" } })
  .then(res => res.docs)
  .then(docs => (store.aircraftCount = docs.length));

DB.find({ selector: { type: "instructor" } })
  .then(res => res.docs)
  .then(docs => (store.instructorCount = docs.length));

DB.find({ selector: { type: "student" } })
  .then(res => res.docs)
  .then(docs => (store.studentCount = docs.length));

export default ({ history }) => {
  const handleCreateTestData = async () => {
    if (store.deleteConfirmation) {
      const testData = await createTestData();
      console.log(testData);
      store.aircraftCount = testData.aircraft.length;
      store.instructorCount = testData.instructors.length;
      store.studentCount = testData.students.length;
      store.deleteConfirmation = false;
      return null;
    }
    store.deleteConfirmation = true;
  };

  const handleDeleteTestData = () => {
    if (store.deleteConfirmation) {
      DB.destroy().then(result => console.log("Deleted 'stp-logbook'", result));
      store.aircraftCount = 0;
      store.instructorCount = 0;
      store.studentCount = 0;
      store.deleteConfirmation = false;
      return null;
    }

    store.deleteConfirmation = true;
    return null;
  };

  return (
    <section>
      <details>
        <summary>Fake Data For Testing</summary>
        <div className="warning">
          <h3>Warning</h3>
          <p>
            Using this feature will <strong>COMPLETELY</strong> overwrite any
            data you have created. The data is stored locally in your browser,
            so it's not the end of the world if you fuck it up, though. Just
            sayin'. That said, feel free to create some fake data!
          </p>
        </div>
        <table>
          <caption>Current Data</caption>
          <thead>
            <tr>
              <th>Data Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => history.push("/aircraft")}>
              <td>Aircraft</td>
              <td>{store.aircraftCount}</td>
            </tr>
            <tr onClick={() => history.push("/instructors")}>
              <td>Instructors</td>
              <td>{store.instructorCount}</td>
            </tr>
            <tr onClick={() => history.push("/students")}>
              <td>Students</td>
              <td>{store.studentCount}</td>
            </tr>
          </tbody>
        </table>
        {store.studentCount === 0 ? (
          <button
            className={store.deleteConfirmation ? "warning" : null}
            onClick={handleCreateTestData}
          >
            Create Test Data
          </button>
        ) : (
          <button
            className={store.deleteConfirmation ? "warning" : null}
            onClick={handleDeleteTestData}
          >
            Delete Test Data
          </button>
        )}
      </details>
    </section>
  );
};
