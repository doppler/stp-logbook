import DB from "../../../DB";
import getJumps from "./getJumps";

const getStudents = async () => {
  const res = await DB.find({ selector: { type: "student" } });
  const students = await Promise.all(
    res.docs.map(async student => {
      student.jumps = await getJumps(student);
      return student;
    })
  );
  return students;
};

export default getStudents;
