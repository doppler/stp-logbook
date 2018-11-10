export default async student => {
  // first, make sure we have up-to-date student list
  const dbStudents = await fetch("/api/students").then(res => res.json());

  // check required field
  const requiredFields = [
    "name",
    "email",
    "phone",
    "instructor",
    "previousJumps"
  ];
  const blankFields = requiredFields
    .map(f => (student[f] === "" ? f : null))
    .filter(f => f !== null);
  if (blankFields.length > 0) {
    return { error: `${blankFields.join(", ")} cannot be blank` };
  }
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
