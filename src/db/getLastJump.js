import DB from "../DB";

const getLastJump = async student => {
  const _id = [...student.jumps].pop();
  if (!_id) {
    console.warn("Missing jump._id for student", student._id, student); // eslint-disable-line
    return [];
  }
  return await DB.get(_id)
    .then(res => {
      return [res];
    })
    .catch(err => {
      console.error(err); // eslint-disable-line
      return [];
    });
};

export default getLastJump;
