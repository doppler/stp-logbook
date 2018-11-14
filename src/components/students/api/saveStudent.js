const validateStudent = require("./validateStudent");
const validateJump = require("./validateJump");

const saveStudent = async (student, jump) => {
  const validation = jump ? validateJump(jump) : validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }

  const res = JSON.parse(localStorage.getItem("stp-logbook:students"));
  const students = res
    ? [student, ...res.filter(o => o.id !== student.id)]
    : [student];

  localStorage.setItem("stp-logbook:students", JSON.stringify(students));

  return {};
};

export default saveStudent;
