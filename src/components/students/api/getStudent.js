import DB from "../../../DB";
import getJumps from "./getJumps";

const getStudent = async _id => {
  const student = await DB.get(_id);
  const jumps = await getJumps(student);
  student.jumps = jumps;
  return student;
};

export default getStudent;
