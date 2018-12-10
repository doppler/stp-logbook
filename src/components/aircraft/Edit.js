import React, { useState, useEffect } from "react";
import HotKeys from "react-hot-keys";

import getSingleAircraft from "../../db/getSingleAircraft";
import saveAircraft from "../../db//saveAircraft";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";
import useDeleteConfirmation from "../../utils/useDeleteConfirmation";

const initialState = {
  _id: Math.round(Math.random() * 2 ** 32).toString(16),
  type: "aircraft",
  name: "",
  tailNumber: ""
};

const Edit = ({ match, history }) => {
  const [currentAircraft, setCurrentAircraft] = useState(null);

  const fetchData = async () => {
    if (match.path === "/aircraft/new") setCurrentAircraft(initialState);
    else {
      const aircraft = await getSingleAircraft(match.params.id);
      setCurrentAircraft(aircraft);
    }
  };

  useEffect(() => fetchData(), []);

  if (!currentAircraft) return false;

  const save = async e => {
    e.preventDefault();
    removeErrorClass();
    const res = await saveAircraft(currentAircraft);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${currentAircraft.name}` });
    history.goBack(1);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useDeleteConfirmation();

  const deleteAircraft = async e => {
    e.preventDefault();
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return false;
    }
    currentAircraft._deleted = true;
    const res = await saveAircraft(currentAircraft);
    if (res.error) return flash(res);
    flash({ success: `Deleted ${currentAircraft.name}` });
    history.goBack(1);
  };

  const setAttribute = event => {
    const { id, value } = event.target;
    const updatedAC = { ...currentAircraft };
    switch (id) {
      default:
        updatedAC[id] = value;
        break;
    }
    setCurrentAircraft(updatedAC);
  };

  const onKeyDown = (keyName, e, handle) => {
    if (e.srcElement.type === "submit" && keyName === "enter") {
      return e.srcElement.children[0].click();
    }
    switch (true) {
      default:
        document.getElementById(keyName.match(/.$/)).click();
        break;
    }
  };

  document.title = `STP: Aircraft EDIT ${currentAircraft.name}`;

  return (
    <HotKeys keyName="ctrl+s,ctrl+d" onKeyDown={onKeyDown}>
      <div className="Content">
        <form onSubmit={save}>
          <fieldset>
            <legend>
              Editing{" "}
              {currentAircraft.name
                ? currentAircraft.name
                : `New Aircraft (id:${currentAircraft._id})`}
            </legend>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                onChange={setAttribute}
                value={currentAircraft.name}
                placeholder="Full Name"
                className="formField required"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Tail Number</label>
              <input
                id="tailNumber"
                onChange={setAttribute}
                value={currentAircraft.tailNumber}
                placeholder="N 1234Z"
                className="formField required"
                required
              />
            </div>
            <button id="s" onClick={save} className="hotkey-button">
              Save Aircraft
            </button>
            <button
              id="d"
              onClick={deleteAircraft}
              className={`hotkey-button ${
                deleteConfirmation ? "warning" : null
              }`}
            >
              Delete Aircraft
            </button>
          </fieldset>
        </form>
      </div>
    </HotKeys>
  );
};

export default Edit;
