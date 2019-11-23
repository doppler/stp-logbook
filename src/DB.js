import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
PouchDB.plugin(PouchdbFind);

const dbOptions = {
  auto_compaction: true
};

/* eslint-disable no-undef, global-require, no-console, no-unused-vars */
if (process.env.NODE_ENV === "test") {
  PouchDB.plugin(require("pouchdb-adapter-memory"));
  dbOptions.adapter = "memory";
}

const DB = new PouchDB("stp-logbook", dbOptions);

export const startReplication = async () => {
  const masterURL = localStorage.getItem("stp-logbook:couchDbUrl");

  if (masterURL) {
    const res = await fetch(masterURL);
    const json = await res.json();
    if (json.db_name) {
      console.debug(`Starting replication with ${masterURL}`);
      const opts = { live: true, retry: true };

      DB.replicate.from(masterURL).on("complete", info => {
        console.debug(info);
        DB.sync(masterURL, opts).on("error", error => console.error(error));
      });
      return json.db_name;
    } else return json.error;
  } else return false;
};
startReplication();

/* eslint-enable */
export default DB;
