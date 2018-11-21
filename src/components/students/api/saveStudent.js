import DB from "../../../DB";
import validateStudent from "./validateStudent";

const saveStudent = async student => {
  console.log("saveStudent", student);
  const validation = validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }

  const result = await DB.put(student);
  console.log(result);
  return student;
};

export default saveStudent;
