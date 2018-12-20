import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
PouchDB.plugin(PouchdbFind);

const dbOptions = {
  auto_compaction: true
};

/* eslint-disable no-undef, global-require */
if (process.env.NODE_ENV === "test") {
  PouchDB.plugin(require("pouchdb-adapter-memory"));
  dbOptions.adapter = "memory";
}
/* eslint-enable */

const DB = new PouchDB("stp-logbook", dbOptions);

(async () => {
  const masterURL = localStorage.getItem("stp-logbook:couchDbUrl");

  if (masterURL) {
    const res = await fetch(masterURL);
    const json = await res.json();
    if (json.db_name) {
      console.debug(`Starting replication with ${masterURL}`); // eslint-disable-line
      const opts = { live: true, retry: true };

      DB.replicate.from(masterURL).on("complete", info => {
        console.debug(info); // eslint-disable-line
        DB.sync(masterURL, opts).on("error", error => console.error(error)); // eslint-disable-line
      });
    }
  }
})();
export default DB;
