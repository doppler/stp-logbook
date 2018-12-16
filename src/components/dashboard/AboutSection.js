import React from "react";

const AboutSection = () => (
  <section>
    <details>
      <summary>About</summary>
      <h1>
        <strong>
          <code>stp-logbook</code>
        </strong>{" "}
        is a work in progress.
      </h1>
      <p>
        <strong>
          <code>stp-logbook</code>
        </strong>{" "}
        will help skydive instructors log their students&apos; jumps in an
        efficient manner by providing clever shortcuts to typing common log
        entry phrases.
      </p>
      <p>
        With a quick glance, instructors can determine when students are
        approaching uncurrency, when their last jump was, which dive flow it
        was, and which instructor they were with.
      </p>
      <p>
        <strong>
          <code>stp-logbook</code>
        </strong>{" "}
        is largely navigable via keyboard shortcuts. Buttons which are keyboard
        accessible have labels with the first letter highlighted. To
        &quot;click&quot; the button, type{" "}
        <strong>
          <code>ctrl+[letter]</code>
        </strong>
        .
      </p>
      <p>
        <strong>
          <code>stp-logbook</code>
        </strong>{" "}
        is under active development since Tuesday, November 6th 2018, and
        it&apos;s still got a long way to go.
      </p>
      <p>Planned features include:</p>
      <ul>
        <li>
          <strong>
            <em>Phrase Cloud</em>
          </strong>{" "}
          log entry text creation. Rather than typing, select common log entry
          phrases from a collection of common phrases.
        </li>
        <li>
          <strong>Backend Integration</strong> will be needed for storing and
          editing of videos as well as syncronization of data between clients.
          Duh.
        </li>
        <li>
          <strong>
            <em>Drag and Drop Video</em>
          </strong>{" "}
          management. Drag your student&apos;s video directly from your SD card
          to the student&apos;s log entry.
        </li>
        <li>
          <strong>
            <em>Video Trimming</em>
          </strong>{" "}
          capability. Trim the video to remove unwanted plane and instructor
          canopy content.
        </li>
        <li>
          <strong>
            <em>Printer Friendly Output</em>
          </strong>{" "}
          so the student has a record of their jumps.
        </li>
      </ul>
    </details>
  </section>
);

export default AboutSection;
