const exampleInstructor = require("./example-instructor");

const getInstructors = async () => {
  const instructors =
    JSON.parse(localStorage.getItem("stp-logbook:instructors")) ||
    exampleInstructor.default;
  return instructors;
};

export default getInstructors;
