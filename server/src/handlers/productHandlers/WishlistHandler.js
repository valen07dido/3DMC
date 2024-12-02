const {
  wishlistController,
  getWishlistController,
} = require("../../controllers/productControllers/WishlistController");

const wishlistHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const response = await wishlistController(id, productId);
    if (response.error) return res.status(404).json(response.response);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getWishlistHandler = async (req, res) => {
  const { id } = req.params;
  const result = await getWishlistController(id);
  if (result.error) {
    return res.status(400).json({ message: result });
  }
  return res.json({
    message: result.response,
    products: result.products,
  });
};
module.exports = {
  wishlistHandler,
  getWishlistHandler
};
