import DB from "../DB";
import validateAircraft from "./validateAircraft";

const saveAircraft = async ac => {
  const validation = validateAircraft(ac);
  if (validation.error) {
    return { error: validation.error.details };
  }

  if (ac._rev) {
    return DB.get(ac._id).then(res => {
      ac._rev = res._rev;
      return DB.put(ac).then(res => {
        return res;
      });
    });
  } else {
    return DB.put(ac).then(res => {
      return res;
    });
  }
};

export default saveAircraft;
