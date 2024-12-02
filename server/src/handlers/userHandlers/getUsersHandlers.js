const {
  getUsers,
  getUsersByID,
} = require("../../controllers/userControllers/getUsers");

const getUserhandler = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const response = await getUsersByID(id);
      if (response.error) return res.status(404).json(response.response);
      return res.status(200).json(response);
    }
    const response = await getUsers();
    if (response.error) return res.status(404).json(response.response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  getUserhandler,
};
