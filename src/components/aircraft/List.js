import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HotKeys } from "react-hotkeys";
import getAircraft from "../../db/getAircraft";

const List = ({ history }) => {
  const [aircraft, setAircraft] = useState([]);
  const [activeRow, setActiveRow] = useState(0);

  const fetchData = async () => {
    const aircraft = await getAircraft();
    setAircraft(aircraft);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = aircraft => {
    history.push(`/aircraft/${aircraft._id}`);
  };

  const addAircraft = () => {
    history.push("/aircraft/new");
  };

  const rowCount = aircraft.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  useEffect(() => {
    document.title = "STP: Aircraft";
  }, []);

  const keyMap = {
    moveToNextRow: ["down", "j"],
    moveToPrevRow: ["up", "k"],
    selectCurrentRow: ["right", "enter"],
    addAircraft: ["ctrl+a"]
  };

  const handlers = {
    moveToNextRow: event => {
      event.preventDefault();
      setActiveRow(activeRow + 1);
    },
    moveToPrevRow: event => {
      event.preventDefault();
      setActiveRow(activeRow - 1);
    },
    selectCurrentRow: () =>
      history.push(`/aircraft/${aircraft[activeRow]._id}`),
    addAircraft: () => document.getElementById("a").click()
  };

  useEffect(() => document.getElementById("tableBody").focus());

  return (
    <div className="Content">
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <table id="aircraft">
          <caption>Aircraft</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Tail #</th>
            </tr>
          </thead>
          <tbody id="tableBody" tabIndex={0}>
            {aircraft.map((aircraft, i) => (
              <tr
                key={i}
                className={i === activeRow ? "active" : ""}
                onClick={() => handleRowClick(aircraft)}
              >
                <td>{aircraft.name}</td>
                <td>{aircraft.tailNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button id="a" onClick={addAircraft} className="hotkey-button small">
          Add Aircraft
        </button>
      </HotKeys>
    </div>
  );
};

List.propTypes = {
  history: PropTypes.object.isRequired
};

export default List;
