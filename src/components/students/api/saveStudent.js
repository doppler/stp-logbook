import DB from "../../../DB";
import validateStudent from "./validateStudent";

const saveStudent = async student => {
  console.group("saveStudent");
  console.debug(student);
  const validation = validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }

  return DB.get(student._id).then(res => {
    console.debug("get", res);
    student._rev = res._rev;
    return DB.put(student).then(res => {
      console.debug("put", res);
      console.groupEnd("saveStudent");
      return res;
    });
  });
};

export default saveStudent;
