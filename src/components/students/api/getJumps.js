import DB from "../../../DB";

const getJumps = async student => {
  const res = await DB.allDocs({ keys: student.jumps, include_docs: true });
  return res.rows.map(row => row.doc);
};

export default getJumps;
