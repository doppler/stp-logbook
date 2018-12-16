import DB from "../DB";

const getStudent = async _id => {
  const student = await DB.get(_id);
  return student;
};

export default getStudent;
