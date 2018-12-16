import DB from "../DB";
import validateInstructor from "./validateInstructor";

const saveInstructor = async instructor => {
  const validation = validateInstructor(instructor);
  if (validation.error) {
    return { error: validation.error.details };
  }

  if (instructor._rev) {
    return DB.get(instructor._id).then(res => {
      instructor._rev = res._rev;
      return DB.put(instructor).then(res => {
        return res;
      });
    });
  } else {
    return DB.put(instructor).then(res => {
      return res;
    });
  }
};

export default saveInstructor;
