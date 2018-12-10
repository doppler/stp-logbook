import React, { useState, useEffect } from "react";
import HotKeys from "react-hot-keys";
import getAircraft from "../../db/getAircraft";

const List = ({ history }) => {
  const [aircraft, setAircraft] = useState([]);
  const [activeRow, setActiveRow] = useState(0);

  const fetchData = async () => {
    const aircraft = await getAircraft();
    setAircraft(aircraft);
  };

  useEffect(() => fetchData(), []);

  const handleRowClick = aircraft => {
    history.push(`/aircraft/${aircraft._id}`);
  };

  const addAircraft = () => {
    history.push("/aircraft/new");
  };

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return true;
    }
    if (e.srcElement.type !== undefined) return false;
    switch (true) {
      case ["down", "j"].includes(keyName):
        setActiveRow(activeRow + 1);
        break;
      case ["up", "k"].includes(keyName):
        setActiveRow(activeRow - 1);
        break;
      case ["enter", "right"].includes(keyName):
        history.push(`/aircraft/${aircraft[activeRow]._id}`);
        break;
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  const rowCount = aircraft.length;
  if (rowCount > 0 && activeRow === rowCount) setActiveRow(0);
  if (rowCount > 0 && activeRow === -1) setActiveRow(rowCount - 1);

  document.title = "STP: Aircraft";

  return (
    <HotKeys keyName="down,j,up,k,enter,right,ctrl+a" onKeyDown={onKeyDown}>
      <div className="Content">
        <table id="aircraft">
          <caption>Aircraft</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Tail #</th>
            </tr>
          </thead>
          <tbody>
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
      </div>
    </HotKeys>
  );
};

export default List;
