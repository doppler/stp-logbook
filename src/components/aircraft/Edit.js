import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouteMatch, useHistory } from "react-router-dom";
import { HotKeys } from "react-hotkeys";

import getSingleAircraft from "../../db/getSingleAircraft";
import saveAircraft from "../../db//saveAircraft";
import flash from "../../utils/flash";
import handleFormError from "../../utils/handleFormError";
import removeErrorClass from "../../utils/removeErrorClass";
import useDeleteConfirmation from "../../utils/useDeleteConfirmation";

const initialState = {
  _id: `aircraft-${Math.round(Math.random() * 2 ** 32).toString(16)}`,
  type: "aircraft",
  name: "",
  tailNumber: ""
};

const Edit = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const [currentAircraft, setCurrentAircraft] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useDeleteConfirmation();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (match.path === "/aircraft/new") setCurrentAircraft(initialState);
      else {
        const aircraft = await getSingleAircraft(match.params.id);
        setCurrentAircraft(aircraft);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [match]);

  useEffect(() => {
    document.title =
      currentAircraft && currentAircraft.name
        ? `STP: Aircraft EDIT ${currentAircraft.name}`
        : "STP: Loading aircraft";

    return () => {};
  }, [currentAircraft]);

  if (!currentAircraft) return false;

  const save = async event => {
    if (event) event.preventDefault();
    removeErrorClass();
    const res = await saveAircraft(currentAircraft);
    if (res.error) {
      flash({ error: "Please check form for errors." });
      return handleFormError(res.error);
    }
    flash({ success: `Saved ${currentAircraft.name}` });
    history.goBack(1);
  };

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

  const keyMap = {
    pressSaveButton: "ctrl+s",
    pressDeleteButton: "ctrl+d"
  };

  const handlers = {
    pressSaveButton: () => save(),
    pressDeleteButton: () => document.getElementById("d").click()
  };

  return (
    <div className="Content">
      <HotKeys keyMap={keyMap} handlers={handlers}>
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
      </HotKeys>
    </div>
  );
};

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Edit;
