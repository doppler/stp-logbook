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
      console.log(`Starting replication with ${masterURL}`);
      const opts = { live: true, retry: true };

      DB.replicate.from(masterURL).on("complete", info => {
        DB.sync(masterURL, opts).on("error", error => console.error(error));
      });
    }
  }
})();
export default DB;
