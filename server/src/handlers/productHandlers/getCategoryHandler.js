const { getCategory }=require("../../controllers/productControllers/getCategories")

const getCategoryHandler = async (req, res) => {
  try {
    const response = await getCategory();

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
  getCategoryHandler,
};
