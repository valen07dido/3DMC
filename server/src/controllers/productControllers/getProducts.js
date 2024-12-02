const {
  Product,
  ProductImage,
  ProductStock,
  ProductCategory,
  ProductType,
} = require("../../db");

const getProducts = async (id) => {
  const includeProductImages = {
    model: ProductImage,
    attributes: ["address", "position"],
  };

  if (id) {
    const product = await Product.findByPk(id, {
      include: [
        includeProductImages,
        {
          model: ProductStock,
          attributes: ["amount"],
        },
        {
          model: ProductCategory,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: ProductType,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!product) {
      return {
        error: true,
        response: "No existe producto con ese ID.",
      };
    }

    return product;
  } else {
    const products = await Product.findAll({
      include: [
        includeProductImages,
        {
          model: ProductStock,
          attributes: ["amount"],
        },
        {
          model: ProductCategory,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: ProductType,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!products || products.length === 0) {
      return {
        error: true,
        response: "No hay productos creados.",
      };
    }

    return products;
  }
};

module.exports = {
  getProducts,
};
