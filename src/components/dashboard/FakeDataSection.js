import React, { useState, useEffect } from "react";
import DB from "../../DB";
import createTestData from "../../utils/createTestData";

export default ({ history }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [aircraftCount, setAircraftCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  const fetchData = async () => {
    let ares = await DB.find({ selector: { type: "aircraft" } });
    let adocs = await ares.docs;
    setAircraftCount(adocs.length);
    let ires = await DB.find({ selector: { type: "instructor" } });
    let idocs = await ires.docs;
    setInstructorCount(idocs.length);
    let sres = await DB.find({ selector: { type: "student" } });
    let sdocs = await sres.docs;
    setStudentCount(sdocs.length);
  };

  useEffect(() => fetchData(), []);

  const handleCreateTestData = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return false;
    }
    const testData = await createTestData();
    setAircraftCount(testData.aircraft.length);
    setInstructorCount(testData.instructors.length);
    setStudentCount(testData.students.length);
    setDeleteConfirmation(false);
    return null;
  };

  const handleDeleteTestData = () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return false;
    }
    DB.destroy().then(result => console.log("Deleted 'stp-logbook'", result));
    setAircraftCount(0);
    setInstructorCount(0);
    setStudentCount(0);
    setDeleteConfirmation(false);
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
              <td>{aircraftCount}</td>
            </tr>
            <tr onClick={() => history.push("/instructors")}>
              <td>Instructors</td>
              <td>{instructorCount}</td>
            </tr>
            <tr onClick={() => history.push("/students")}>
              <td>Students</td>
              <td>{studentCount}</td>
            </tr>
          </tbody>
        </table>
        {studentCount === 0 ? (
          <button
            className={deleteConfirmation ? "warning" : null}
            onClick={handleCreateTestData}
          >
            Create Test Data
          </button>
        ) : (
          <button
            className={deleteConfirmation ? "warning" : null}
            onClick={handleDeleteTestData}
          >
            Delete Test Data
          </button>
        )}
      </details>
    </section>
  );
};
