import DB from "../../../DB";
import validateStudent from "./validateStudent";

const saveStudent = async student => {
  console.log("saveStudent", student);
  const validation = validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }

  // const result = await DB.put(student);
  const result = DB.get(student._id).then(result => {
    student._rev = result._rev;
    // student.jumps = [...student.jumps.map(jump => jump._id)];
    return DB.put(student);
  });
  console.log(result);
  return result;
};

export default saveStudent;
