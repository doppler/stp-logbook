import DB from "../DB";

const index = { fields: ["type", "studentId"] };
const initializeDatabase = () => {
  console.log(DB);
  DB.createIndex({ index }).then(res =>
    console.info("Creating index:", index, res.result)
  );
};

export default initializeDatabase;
