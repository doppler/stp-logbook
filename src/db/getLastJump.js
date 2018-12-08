import DB from "../DB";

const getLastJump = async student => {
  const _id = [...student.jumps].pop();
  if (!_id) {
    console.warn("Missing jump._id for student", student._id, student);
    return [];
  }
  return await DB.get(_id)
    .then(res => {
      // console.debug("getLastJump", student._id, res);
      return [res];
    })
    .catch(err => {
      console.warn(err);
      return [];
    });
};

export default getLastJump;
