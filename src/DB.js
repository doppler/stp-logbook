import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
PouchDB.plugin(PouchdbFind);

const DB = new PouchDB("stp-logbook", { auto_compaction: true });

export default DB;
