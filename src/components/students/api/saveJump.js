import DB from "../../../DB";
import validateJump from "./validateJump";

const saveJump = async jump => {
  const validation = validateJump(jump);
  if (validation.error) {
    return { error: validation.error.details };
  }
  return DB.put(jump);
};

export default saveJump;
