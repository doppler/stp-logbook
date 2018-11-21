import DB from "../../../DB";

const getInstructors = async () => {
  const res = await DB.find({ selector: { type: "instructor" } });
  return res.docs;
};

export default getInstructors;
