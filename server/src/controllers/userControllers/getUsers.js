const { User, UserRole } = require("../../db");

const getUsers = async () => {
  const user = await User.findAll();
  if (user.length === 0) {
    return {
      error: true,
      response: `No existen usuarios.`,
    };
  }
  return user;
};
const getUsersByID = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return {
      error: true,
      response: `Ese usuario no existe`,
    };
  }
  return user;
};

module.exports = {
  getUsers,
  getUsersByID
};
