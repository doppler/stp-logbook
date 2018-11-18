import exampleInstructor from "./example-instructor";

const getInstructors = async () => {
  const instructors =
    JSON.parse(localStorage.getItem("stp-logbook:instructors")) ||
    exampleInstructor;
  return instructors;
};

export default getInstructors;
