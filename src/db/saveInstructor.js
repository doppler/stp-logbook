import DB from "../DB";
import validateInstructor from "./validateInstructor";

const saveInstructor = async instructor => {
  console.group("saveInstructor");
  console.debug(instructor);
  const validation = validateInstructor(instructor);
  if (validation.error) {
    return { error: validation.error.details };
  }

  if (instructor._rev) {
    return DB.get(instructor._id).then(res => {
      console.debug("get", res);
      instructor._rev = res._rev;
      return DB.put(instructor).then(res => {
        console.debug("put", res);
        console.groupEnd("saveInstructor");
        return res;
      });
    });
  } else {
    return DB.put(instructor).then(res => {
      console.debug("saveInstructor new put", res);
      console.groupEnd("saveInstructor");
      return res;
    });
  }
};

export default saveInstructor;
