import React from "react";
import PropTypes from "prop-types";
import HotKeys from "react-hot-keys";
import "./PhraseCloud.css";

import phraseCloud from "./phrase-cloud.json";

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PhraseCloud = ({ setAttribute, phraseCloudKey, jump }) => {
  if (!phraseCloudKey) return null;

  const handlePhraseClick = e => {
    if (e && e.stopPropagation) e.stopPropagation();
    const selections = jump.phraseCloudSelections[phraseCloudKey];
    const keyName = e.target.attributes["data-key"].value;
    if (selections.includes(keyName)) {
      selections.splice(selections.indexOf(keyName), 1);
    } else {
      selections.push(keyName);
    }
    const targetText = selections
      .map(key => phraseCloud[phraseCloudKey][key])
      .join(" ");
    setAttribute({ target: { id: phraseCloudKey, value: targetText } });
  };

  const hidePhraseCloud = e => {
    if (e.target.getAttribute("class") === "outer") {
      document.querySelector("#PhraseCloud").classList.toggle("hidden");
    }
  };

  const onKeyUp = keyName => {
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
            {capitalize(phraseCloudKey)} Phrases{" "}
            <small>
              Click a phrase or press the label key to move to/from target area.
              Click anywhere else or press [esc] to close.
            </small>
          </h2>
          <ul id="target">
            <SelectedPhrases
              handlePhraseClick={handlePhraseClick}
              phraseCloudKey={phraseCloudKey}
              phraseCloudSelections={jump.phraseCloudSelections}
            />
          </ul>
          <ul id="source">
            <AvailablePhrases
              handlePhraseClick={handlePhraseClick}
              phraseCloudKey={phraseCloudKey}
              phraseCloudSelections={jump.phraseCloudSelections}
            />
          </ul>
        </div>
      </div>
    </HotKeys>
  );
};

PhraseCloud.propTypes = {
  setAttribute: PropTypes.func.isRequired,
  phraseCloudKey: PropTypes.string.isRequired,
  jump: PropTypes.object.isRequired
};

export default PhraseCloud;

const SelectedPhrases = ({
  handlePhraseClick,
  phraseCloudKey,
  phraseCloudSelections
}) => {
  return phraseCloudSelections[phraseCloudKey].map(key => (
    <li key={key} data-key={key} onClick={handlePhraseClick}>
      {phraseCloud[phraseCloudKey][key]}
    </li>
  ));
};

const AvailablePhrases = ({
  handlePhraseClick,
  phraseCloudKey,
  phraseCloudSelections
}) => {
  return Object.keys(phraseCloud[phraseCloudKey]).map(key => (
    <li
      key={key}
      data-key={key}
      onClick={handlePhraseClick}
      className={
        phraseCloudSelections[phraseCloudKey].includes(key) ? "selected" : null
      }
    >
      {phraseCloud[phraseCloudKey][key]}
    </li>
  ));
};
