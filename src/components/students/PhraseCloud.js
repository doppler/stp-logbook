import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import "./PhraseCloud.css";

import phraseCloud from "./phrase-cloud.json";

store.phraseCLoud = {};

const PhraseCloud = ({ phrases = "exit" }) => {
  const onKeyDown = (keyName, e, handle) => {
    const phraseCloudIsHidden = document
      .querySelector("#PhraseCloud")
      .classList.contains("hidden");

    if (phraseCloudIsHidden) return null;

    let li = document.querySelector(`li[data-key="${keyName}"]`);
    li.classList.toggle("selected");
  };
  return (
    <HotKeys
      onKeyDown={onKeyDown}
      keyName={Array.from(Array(26))
        .map((_, i) => String.fromCharCode(i + 97))
        .join(",")}
    >
      <div id="PhraseCloud" className={`hidden`}>
        <h2>Phrase Cloud</h2>
        <ul>
          {phraseCloud[phrases].map((phrase, i) => (
            <li key={i} data-key={`${String.fromCharCode(i + 97)}`}>
              {phrase}
            </li>
          ))}
        </ul>
      </div>
    </HotKeys>
  );
};

export default collect(PhraseCloud);
