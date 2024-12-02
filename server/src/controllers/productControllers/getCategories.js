const { ProductCategory } = require("../../db");

const getCategory = async () => {
  const categories = await ProductCategory.findAll();

  if (!categories || categories.length === 0) {
    return {
      error: true,
      response: "No Existen categorias.",
    };
  }

  return categories;
};

module.exports = { getCategory };
