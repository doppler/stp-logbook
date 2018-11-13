import getInstructors from "./getInstructors";
const getInstructor = async id => {
  const instructors = await getInstructors();
  const instructor = instructors.find(o => o.id === id);
  return instructor;
};

export default getInstructor;
