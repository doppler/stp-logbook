import fetchStudents from "./fetchStudents";

export default async id => {
  return fetchStudents().then(json => {
    const student = json.find(student => student.id === id);
    return student;
  });
};
