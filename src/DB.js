import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
PouchDB.plugin(PouchdbFind);

const DB = new PouchDB("stp-logbook", { auto_compaction: true });

const masterURL = "http://localhost:5984/stp-dev";
const opts = { live: true, retry: true };

DB.replicate.from(masterURL).on("complete", info => {
  console.debug(`Replicating from ${masterURL}`, info);
  DB.sync(masterURL, opts)
    .on("change", change => console.debug("DB sync change", change))
    .on("paused", console.debug("DB sync paused"))
    .on("error", error => console.error(error));
});

export default DB;
