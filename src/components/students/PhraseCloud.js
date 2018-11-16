import React from "react";
import HotKeys from "react-hot-keys";
import { store, collect } from "react-recollect";
import "./PhraseCloud.css";

import phraseCloud from "./phrase-cloud.json";

const PhraseCloud = ({ setAttribute }) => {
  const { phraseCloudKey } = store;

  const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePhraseClick = e => {
    if (e && e.stopPropagation) e.stopPropagation();
    const keyName = e.target.attributes["data-key"].value;
    const source = document.querySelector("ul#source");
    const target = document.querySelector("ul#target");

    let li = document.querySelector(`li[data-key="${keyName}"]`);
    if (target.contains(li)) {
      target.removeChild(li);
      source.appendChild(li);
      [...source.children]
        .sort(
          (a, b) =>
            a.attributes["data-key"].value > b.attributes["data-key"].value
              ? 1
              : -1
        )
        .map(node => source.appendChild(node));
    } else {
      target.appendChild(li);
    }
    const targetText = Array.from(target.childNodes)
      .map(el => el.innerHTML)
      .join(" ");
    setAttribute({
      target: {
        id: store.phraseCloudKey,
        value: targetText
      }
    });
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

  const hidePhraseCloud = e => {
    if (e) e.stopPropagation();
    document.querySelector("#PhraseCloud").classList.toggle("hidden");
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
      <div id="PhraseCloud" className={`hidden`} onClick={hidePhraseCloud}>
        <div className="inner">
          <h2>{capitalize(phraseCloudKey)} Phrases</h2>
          <ul id="target" />
          <ul id="source">
            {phraseCloud[phraseCloudKey].map((phrase, i) => (
              <li
                key={i}
                data-key={`${String.fromCharCode(i + 97)}`}
                onClick={handlePhraseClick}
              >
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HotKeys>
  );
};

export default collect(PhraseCloud);
