const validateStudent = require("./validateStudent");
const validateJump = require("./validateJump");

const saveStudent = async (student, jump) => {
  const validation = jump ? validateJump(jump) : validateStudent(student);
  if (validation.error) {
    return { error: validation.error.details };
  }

  const students = await fetch("/api/students")
    .then(res => res.json())
    .then(json => [student, ...json.filter(o => o.id !== student.id)]);

  return fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(students)
  })
    .then(res => res.json())
    .then(json => {
      return json[0];
    })
    .catch(e => {
      return { error: e.message };
    });
};

export default saveStudent;
