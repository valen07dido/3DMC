const {
  updateProductController,
} = require("../../controllers/productControllers/updateProduct");

const updateProductHandler = async (req, res) => {
  const {id} = req.params;
  const { field, value } = req.body;
  try {
    const response = await updateProductController(id, field, value);
    if (response.error) return res.status(404).json(response.response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  updateProductHandler,
};
