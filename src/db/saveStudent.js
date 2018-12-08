import DB from "../DB";
import validateStudent from "./validateStudent";

const saveStudent = async student => {
  console.group("saveStudent");
  const validation = validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }
  if (student._rev) {
    return DB.get(student._id).then(res => {
      console.debug("get", res);
      student._rev = res._rev;
      return DB.put(student).then(res => {
        console.debug("put", res);
        console.groupEnd("saveStudent");
        return res;
      });
    });
  } else {
    return DB.put(student).then(res => {
      console.debug("put", res);
      console.groupEnd("saveStudent");
      return res;
    });
  }
};

export default saveStudent;
