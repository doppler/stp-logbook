import React from "react";
import HotKeys from "react-hot-keys";
import "./PhraseCloud.css";

import phraseCloud from "./phrase-cloud.json";

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PhraseCloud = ({ setAttribute, store }) => {
  if (!store.phraseCloudKey) return null;

  const handlePhraseClick = e => {
    if (e && e.stopPropagation) e.stopPropagation();
    const selections = store.phraseCloudSelections[store.phraseCloudKey];
    const keyName = e.target.attributes["data-key"].value;
    if (selections.includes(keyName)) {
      selections.splice(selections.indexOf(keyName), 1);
    } else {
      selections.push(keyName);
    }
    const targetText = selections
      .map(key => phraseCloud[store.phraseCloudKey][key])
      .join(" ");
    setAttribute({ target: { id: store.phraseCloudKey, value: targetText } });
  };

  const hidePhraseCloud = e => {
    if (e.target.getAttribute("class") === "outer") {
      document.querySelector("#PhraseCloud").classList.toggle("hidden");
    }
  };

  const onKeyUp = (keyName, e, handle) => {
    if (document.querySelector("#PhraseCloud").classList.contains("hidden"))
      return null;
    switch (true) {
      case keyName === "ctrl+enter":
        hidePhraseCloud();
        break;
      default:
        handlePhraseClick({
          target: { attributes: { "data-key": { value: keyName } } }
        });
        break;
    }
  };

  return (
    <HotKeys
      onKeyUp={onKeyUp}
      keyName={
        Array.from(Array(26))
          .map((_, i) => String.fromCharCode(i + 97))
          .join(",") + ",ctrl+enter"
      }
    >
      <div
        id="PhraseCloud"
        className={`outer hidden`}
        onClick={hidePhraseCloud}
      >
        <div className="inner" onClick={null}>
          <h2>
            {capitalize(store.phraseCloudKey)} Phrases{" "}
            <small>
              Click a phrase or press the label key to move to/from target area.
              Click anywhere else or press [esc] to close.
            </small>
          </h2>
          <ul id="target">
            <SelectedPhrases
              handlePhraseClick={handlePhraseClick}
              store={store}
            />
          </ul>
          <ul id="source">
            <AvailablePhrases
              handlePhraseClick={handlePhraseClick}
              store={store}
            />
          </ul>
        </div>
      </div>
    </HotKeys>
  );
};

export default PhraseCloud;

const SelectedPhrases = ({ handlePhraseClick, store }) => {
  return store.phraseCloudSelections[store.phraseCloudKey].map(key => (
    <li key={key} data-key={key} onClick={handlePhraseClick}>
      {phraseCloud[store.phraseCloudKey][key]}
    </li>
  ));
};

const AvailablePhrases = ({ handlePhraseClick, store }) => {
  return Object.keys(phraseCloud[store.phraseCloudKey]).map(key => (
    <li
      key={key}
      data-key={key}
      onClick={handlePhraseClick}
      className={
        store.phraseCloudSelections[store.phraseCloudKey].includes(key)
          ? "selected"
          : null
      }
    >
      {phraseCloud[store.phraseCloudKey][key]}
    </li>
  ));
};
