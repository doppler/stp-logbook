import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
PouchDB.plugin(PouchdbFind);

const DB = new PouchDB("stp-logbook", { auto_compaction: true });

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
