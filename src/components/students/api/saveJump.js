import DB from "../../../DB";
import validateJump from "./validateJump";

const saveJump = async jump => {
  const validation = validateJump(jump);
  if (validation.error) {
    return { error: validation.error.details };
  }
  return DB.get(jump._id).then(res => {
    jump._rev = res._rev;
    return DB.put(jump);
  });
};

export default saveJump;
