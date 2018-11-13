const exampleInstructor = require("./example-instructor");

const getInstructors = async () => {
  const instructors =
    JSON.parse(localStorage.getItem("stp-logbook:instructors")) ||
    exampleInstructor.default;
  console.log(instructors);
  return instructors;
};

export default getInstructors;
