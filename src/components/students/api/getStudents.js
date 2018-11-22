import DB from "../../../DB";
import getLastJump from "./getLastJump";

const getStudents = async () => {
  console.group("getStudents");
  const res = await DB.find({ selector: { type: "student" } });
  const students = await Promise.all(
    res.docs.map(async student => {
      student.jumps = await getLastJump(student);
      // console.debug("getStudents getLastJump", student);
      return student;
    })
  );
  console.groupEnd("getStudents");
  return students;
};

export default getStudents;
