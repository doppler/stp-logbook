import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import Header from "./Header";
import SyncSettingsForm from "./settings/SyncSettingsForm";
import "./Home.css";

import createTestData from "../utils/createTestData";

import DB from "../DB";

store.deleteConfirmation = false;

DB.find({ selector: { type: "aircraft" } })
  .then(res => res.docs)
  .then(docs => (store.aircraftCount = docs.length));

DB.find({ selector: { type: "instructor" } })
  .then(res => res.docs)
  .then(docs => (store.instructorCount = docs.length));

DB.find({ selector: { type: "student" } })
  .then(res => res.docs)
  .then(docs => (store.studentCount = docs.length));

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

  const onKeyDown = (keyName, e, handle) => {
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  document.title = "STP: Dashboard";

  return (
    <React.Fragment>
      <Header />
      <HotKeys keyName="ctrl+s" onKeyDown={onKeyDown}>
        <div className="Home Content">
          <nav>
            <button
              className="hotkey-button"
              id="s"
              onClick={() => history.push("/students")}
            >
              Students
            </button>
          </nav>
          <section>
            <details open>
              <summary>Settings</summary>
              <p>
                <a href="/instructors">Manage Instructors</a>
              </p>
              <p>
                <a href="/aircraft">Manage Aircraft</a>
              </p>
              <SyncSettingsForm />
            </details>
          </section>
          <section>
            <details>
              <summary>About</summary>
              <h1>
                <strong>
                  <code>stp-logbook</code>
                </strong>{" "}
                is a work in progress.
              </h1>
              <p>
                <strong>
                  <code>stp-logbook</code>
                </strong>{" "}
                will help skydive instructors log their students' jumps in an
                efficient manner by providing clever shortcuts to typing common
                log entry phrases.
              </p>
              <p>
                With a quick glance, instructors can determine when students are
                approaching uncurrency, when their last jump was, which dive
                flow it was, and which instructor they were with.
              </p>
              <p>
                <strong>
                  <code>stp-logbook</code>
                </strong>{" "}
                is largely navigable via keyboard shortcuts. Buttons which are
                keyboard accessible have labels with the first letter
                highlighted. To "click" the button, type{" "}
                <strong>
                  <code>ctrl+[letter]</code>
                </strong>
                .
              </p>
              <p>
                <strong>
                  <code>stp-logbook</code>
                </strong>{" "}
                is under active development since Tuesday, November 6th 2018,
                and it's still got a long way to go.
              </p>
              <p>Planned features include:</p>
              <ul>
                <li>
                  <strong>
                    <em>Phrase Cloud</em>
                  </strong>{" "}
                  log entry text creation. Rather than typing, select common log
                  entry phrases from a collection of common phrases.
                </li>
                <li>
                  <strong>Backend Integration</strong> will be needed for
                  storing and editing of videos as well as syncronization of
                  data between clients. Duh.
                </li>
                <li>
                  <strong>
                    <em>Drag and Drop Video</em>
                  </strong>{" "}
                  management. Drag your student's video directly from your SD
                  card to the student's log entry.
                </li>
                <li>
                  <strong>
                    <em>Video Trimming</em>
                  </strong>{" "}
                  capability. Trim the video to remove unwanted plane and
                  instructor canopy content.
                </li>
                <li>
                  <strong>
                    <em>Printer Friendly Output</em>
                  </strong>{" "}
                  so the student has a record of their jumps.
                </li>
              </ul>
            </details>
          </section>
          <section>
            <details>
              <summary>Fake Data For Testing</summary>
              <div className="warning">
                <h3>Warning</h3>
                <p>
                  Using this feature will <strong>COMPLETELY</strong> overwrite
                  any data you have created. The data is stored locally in your
                  browser, so it's not the end of the world if you fuck it up,
                  though. Just sayin'. That said, feel free to create some fake
                  data!
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
        </div>
      </HotKeys>
    </React.Fragment>
  );
};

export default collect(Home);
