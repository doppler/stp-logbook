import exampleStudent from "./example-student";

const getStudents = async () => {
  const students =
    JSON.parse(localStorage.getItem("stp-logbook:students")) || exampleStudent;
  return students;
};

export default getStudents;
