import validateInstructor from "./validateInstructor";

const saveInstructor = async instructor => {
  const validation = validateInstructor(instructor);
  if (validation.error) {
    return { error: validation.error.details };
  }

  const res = JSON.parse(localStorage.getItem("stp-logbook:instructors"));
  const instructors = res
    ? [instructor, ...res.filter(o => o.id !== instructor.id)]
    : [instructor];

  localStorage.setItem("stp-logbook:instructors", JSON.stringify(instructors));

  return {};
};

export default saveInstructor;
