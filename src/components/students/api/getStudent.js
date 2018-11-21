import DB from "../../../DB";

const getStudent = async _id => {
  const student = await DB.get(_id);
  console.debug("getStudent", student);
  return student;
};

export default getStudent;
