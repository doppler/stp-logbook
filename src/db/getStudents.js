import DB from "../DB";
import getLastJump from "./getLastJump";

const getStudents = async () => {
  const res = await DB.find({ selector: { type: "student" } });
  const students = await Promise.all(
    res.docs.map(async student => {
      student.jumps = await getLastJump(student);
      return student;
    })
  );
  return students;
};

export default getStudents;
