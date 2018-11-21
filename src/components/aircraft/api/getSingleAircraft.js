import DB from "../../../DB";

const getSingleAircraft = async _id => {
  return await DB.get(_id);
};

export default getSingleAircraft;
