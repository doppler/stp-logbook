import DB from "../../../DB";

const getInstructor = async _id => {
  return await DB.get(_id);
};

export default getInstructor;
