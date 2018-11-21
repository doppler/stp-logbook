import DB from "../../../DB";

const getAircraft = async () => {
  const res = await DB.find({ selector: { type: "aircraft" } });
  return res.docs;
};

export default getAircraft;
