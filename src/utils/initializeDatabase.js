import DB from "../DB";

const index = { fields: ["type", "studentId"] };
const initializeDatabase = () => {
  console.group("initializeDatabase");
  console.debug(DB);
  DB.createIndex({ index }).then(res =>
    console.debug("Creating index:", index, res.result)
  );
  console.groupEnd("initializeDatabase");
};

export default initializeDatabase;
