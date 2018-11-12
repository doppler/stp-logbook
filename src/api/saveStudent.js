const validate = require("./validateStudent");

export default async student => {
  const removeErrorClass = ({ value }) => {
    const els = document.getElementsByClassName("formField error");
    while (els[0]) {
      els[0].classList.remove("error");
    }
  };
  const validation = validate(student);
  removeErrorClass(validation);
  if (validation.error) {
    // console.table(validation);
    return { error: validation.error.details };
  }
  // first, make sure we have up-to-date student list
  const dbStudents = await fetch("/api/students").then(res => res.json());

  // new list with current student appended to
  // previous list with student filtered out
  const students = [student, ...dbStudents.filter(o => o.id !== student.id)];
  // post fresh student list
  return fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(students)
  })
    .then(res => res.json())
    .then(json => {
      // return only first student
      return json[0];
    })
    .catch(e => {
      return { error: e.message };
    });
};
