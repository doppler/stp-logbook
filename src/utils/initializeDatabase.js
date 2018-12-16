import DB from "../DB";
// import createTestData from "./createTestData";

const index = { fields: ["type", "studentId"] };
const initializeDatabase = async () => {
  let res = await DB.createIndex({ index });
  console.debug("Creating index:", index, res.result); // eslint-disable-line

  return await DB.find({ selector: { type: "student" } }).then(res => {
    if (res.docs.length === 0) {
      // return createTestData();
    }
  });
};

export default initializeDatabase;
