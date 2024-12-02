const createProduct  = require("../../controllers/productControllers/createProduct");

const createProductHandler = async (req, res) => {
  try {
    const { body, files } = req; // Obtiene body y files
    const images = files.map(file => file.path); // Obtiene las rutas de las imágenes subidas
    const productData = { ...body, images }; // Combina los datos del producto con las imágenes

    const newProduct = await createProduct(productData); // Llama a la función de creación con los datos combinados
    if (newProduct.error) {
      return res.status(400).json(newProduct);
    }
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

module.exports = {
  createProductHandler,
};
