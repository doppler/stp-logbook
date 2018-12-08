import DB from "../DB";
import validateAircraft from "./validateAircraft";

const saveAircraft = async ac => {
  console.group("saveAircraft");
  console.log(ac);
  const validation = validateAircraft(ac);
  if (validation.error) {
    return { error: validation.error.details };
  }

  if (ac._rev) {
    return DB.get(ac._id).then(res => {
      console.debug("get", res);
      ac._rev = res._rev;
      return DB.put(ac).then(res => {
        console.debug("put", res);
        console.groupEnd("saveAircraft");
        return res;
      });
    });
  } else {
    return DB.put(ac).then(res => {
      console.debug("saveAircraft new put", res);
      console.groupEnd("saveAircraft");
      return res;
    });
  }
};

export default saveAircraft;
