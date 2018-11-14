const exampleStudent = require("./example-student");

const getStudents = async () => {
  const students =
    JSON.parse(localStorage.getItem("stp-logbook:students")) ||
    exampleStudent.default;
  return students;
};

export default getStudents;
