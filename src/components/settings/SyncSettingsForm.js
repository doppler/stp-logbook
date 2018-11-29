import React, { useState, useEffect } from "react";

const SyncSettingsForm = () => {
  const [couchDbUrlValue, changeCouchDbUrlValue] = useState("");
  const [changingCouchDbUrlValue, setChangingCouchDbUrlValue] = useState(false);

  useEffect(() => {
    if (!changingCouchDbUrlValue) {
      console.log("fetching couchDbUrl from localStorage");
      const dbUrl = localStorage.getItem("stp-logbook:couchDbUrl");
      if (dbUrl) {
        changeCouchDbUrlValue(dbUrl);
      }
    }
  }, []);

  const enableChangeCouchDbUrlValue = e => {
    setChangingCouchDbUrlValue(true);
    const field = document.querySelector("#couchDbUrlValue");
    field.focus();
    field.select();
  };

  const handleChangeCouchDbUrlValue = e => {
    changeCouchDbUrlValue(e.target.value);
  };

  const handleSaveCouchDbUrl = e => {
    console.debug("handleSaveCouchDbUrl");
    e.preventDefault();
    localStorage.setItem("stp-logbook:couchDbUrl", couchDbUrlValue);
    setChangingCouchDbUrlValue(false);
  };

  return (
    <div className="SyncSettingsForm">
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <fieldset>
          <legend>Sync to remote CouchDB</legend>
          <input
            id="couchDbUrlValue"
            size={30}
            type="text"
            value={couchDbUrlValue}
            onChange={handleChangeCouchDbUrlValue}
            placeholder="https://example.com:5984/stp-logbook"
            disabled={!changingCouchDbUrlValue}
          />
          {changingCouchDbUrlValue ? (
            <button onClick={handleSaveCouchDbUrl}>Save</button>
          ) : (
            <button onClick={enableChangeCouchDbUrlValue}>Change</button>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default SyncSettingsForm;
