import DB from "../../../DB";

const getJumps = async student => {
  const res = await DB.allDocs({ keys: student.jumps, include_docs: true });
  console.debug("getJumps", res);
  return res.rows.map(row => row.doc);
};

export default getJumps;
