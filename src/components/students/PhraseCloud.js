import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import "./PhraseCloud.css";

import phraseCloud from "./phrase-cloud.json";

const PhraseCloud = () => {
  const { phraseCloudKey } = store;

  const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onKeyDown = (keyName, e, handle) => {
    if (document.querySelector("#PhraseCloud").classList.contains("hidden"))
      return null;

    const target = document.querySelector("ul#target");

    let li = document.querySelector(`li[data-key="${keyName}"]`);
    // li.classList.toggle("selected");
    target.appendChild(li);
  };
  return (
    <HotKeys
      onKeyDown={onKeyDown}
      keyName={Array.from(Array(26))
        .map((_, i) => String.fromCharCode(i + 97))
        .join(",")}
    >
      <div id="PhraseCloud" className={``}>
        <h2>{capitalize(phraseCloudKey)} Phrases</h2>
        <ul id="target" />
        <ul id="source">
          {phraseCloud[phraseCloudKey].map((phrase, i) => (
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
