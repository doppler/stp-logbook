import getStudents from "./getStudents";

export default async id => {
  return getStudents().then(json => {
    const student = json.find(obj => obj.id === id);
    return student;
  });
};
