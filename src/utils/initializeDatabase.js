import DB from "../DB";
import createTestData from "./createTestData";

const index = { fields: ["type", "studentId"] };
const initializeDatabase = async () => {
  console.group("initializeDatabase");
  console.debug(DB);
  let res = await DB.createIndex({ index });
  console.debug("Creating index:", index, res.result);

  return await DB.find({ selector: { type: "student" } }).then(res => {
    if (res.docs.length === 0) {
      return createTestData();
    }
    console.groupEnd("initializeDatabase");
  });
};

export default initializeDatabase;
