import DB from "../DB";
import validateJump from "./validateJump";

const saveJump = async jump => {
  console.group("saveJump");
  console.log(jump);
  const validation = validateJump(jump);
  if (validation.error) {
    return { error: validation.error.details };
  }
  if (jump._rev) {
    return DB.get(jump._id).then(res => {
      console.debug("saveJump existing get", res);
      jump._rev = res._rev;
      return DB.put(jump).then(res => {
        console.debug("saveJump existing put", res);
        console.groupEnd("saveJump");
        return res;
      });
    });
  } else {
    return DB.put(jump).then(res => {
      console.debug("saveJump new put", res);
      console.groupEnd("saveJump");
      return res;
    });
  }
};

export default saveJump;
