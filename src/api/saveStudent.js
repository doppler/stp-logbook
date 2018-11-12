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
