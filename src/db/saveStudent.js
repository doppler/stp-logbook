import DB from "../DB";
import validateStudent from "./validateStudent";

const saveStudent = async student => {
  const validation = validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }
  if (student._rev) {
    return DB.get(student._id).then(res => {
      student._rev = res._rev;
      return DB.put(student).then(res => {
        return res;
      });
    });
  } else {
    return DB.put(student).then(res => {
      return res;
    });
  }
};

export default saveStudent;
