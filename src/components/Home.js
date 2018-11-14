import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import Header from "./Header";
import Footer from "./Footer";
import "./Home.css";

import createTestData from "../utils/createTestData";

store.deleteConfirmation = false;

store.aircraftCount = localStorage.getItem("stp-logbook:aircraft")
  ? JSON.parse(localStorage.getItem("stp-logbook:aircraft")).length
  : 0;

store.instructorCount = localStorage.getItem("stp-logbook:instructors")
  ? JSON.parse(localStorage.getItem("stp-logbook:instructors")).length
  : 0;

store.studentCount = localStorage.getItem("stp-logbook:students")
  ? JSON.parse(localStorage.getItem("stp-logbook:students")).length
  : 0;

const Home = ({ history }) => {
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
    console.log("handleCreateTestData()");
    if (store.deleteConfirmation) {
      localStorage.clear();
      store.aircraftCount = 0;
      store.instructorCount = 0;
      store.studentCount = 0;
      store.deleteConfirmation = false;
      return null;
    }
    console.log("handleCreateTestData()");

    store.deleteConfirmation = true;
    return null;
  };

  const onKeyDown = (keyName, e, handle) => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  if (store.headerButtons.length === 0)
    store.headerButtons = [
      {
        id: "s",
        onClick: () => history.push("/students"),
        children: "Students"
      },
      {
        id: "i",
        onClick: () => history.push("/instructors"),
        children: "Instructors"
      },
      {
        id: "a",
        onClick: () => history.push("/aircraft"),
        children: "Aircraft"
      }
    ];

  return (
    <React.Fragment>
      <Header buttons={store.headerButtons} />
      <HotKeys keyName="ctrl+s,ctrl+i,ctrl+a" onKeyDown={onKeyDown}>
        <div className="Content">
          <section>
            <details open>
              <summary>Fake Data For Testing</summary>
              <div className="warning">
                <h3>Warning</h3>
                <p>
                  Using this feature will <strong>COMPLETELY</strong> overwrite
                  any data you have created.
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
                  <tr>
                    <td>Aircraft</td>
                    <td>{store.aircraftCount}</td>
                  </tr>
                  <tr>
                    <td>Instructors</td>
                    <td>{store.instructorCount}</td>
                  </tr>
                  <tr>
                    <td>Students</td>
                    <td>{store.studentCount}</td>
                  </tr>
                </tbody>
              </table>
              {store.studentCount === 0 ? (
                <button
                  className={store.deleteConfirmation ? "confirm" : null}
                  onClick={handleCreateTestData}
                >
                  Create Test Data
                </button>
              ) : (
                <button
                  className={store.deleteConfirmation ? "confirm" : null}
                  onClick={handleDeleteTestData}
                >
                  Delete Test Data
                </button>
              )}
            </details>
          </section>
        </div>
      </HotKeys>
      <Footer />
    </React.Fragment>
  );
};

export default collect(Home);
