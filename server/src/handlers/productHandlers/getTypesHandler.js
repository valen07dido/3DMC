const { getTypes } = require("../../controllers/productControllers/getTypes");

const getTypesHandler = async (req, res) => {
  try {
    const response = await getTypes();

    if (response.error) {
      return res.status(404).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(404)
      .json({ error: true, response: "fallo interno del servidor." });
  }
};

module.exports = {
    getTypesHandler,
};
