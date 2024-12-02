const { User, Product, WishList, ProductImage, ProductStock, ProductCategory, ProductType } = require("../../db");

const wishlistController = async (userId, productId) => {
  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return {
        error: true,
        response: "No se encontró un usuario",
      };
    }

    const existingProduct = await Product.findByPk(productId);
    if (!existingProduct) {
      return {
        error: true,
        response: "No se encontró producto",
      };
    }

    let wishlist = await WishList.findOne({ where: { userId } });

    if (!wishlist) {
      wishlist = await WishList.create({ userId });
    }

    const productInWishlist = await wishlist.hasProduct(existingProduct);

    if (productInWishlist) {
      await wishlist.removeProduct(existingProduct);
      return { response: "Producto eliminado de la wishlist" };
    } else {
      await wishlist.addProduct(existingProduct);
      return { response: "Producto añadido a la wishlist" };
    }
  } catch (error) {
    return {
      error: true,
      response: "Campo de producto no válido para actualizar.",
    };
  }
};

const getWishlistController = async (userId) => {
  try {
    // Verifica si el usuario existe
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return {
        error: true,
        response: "No se encontró un usuario",
      };
    }

    // Verifica si la wishlist del usuario existe
    const wishlist = await WishList.findOne({
      where: { userId },
      include: [{
        model: Product,
        include: [
          {
            model: ProductImage,
            attributes: ["address"],
          },
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
        ]
      }],
    });

    if (!wishlist) {
      return {
        error: false,
        response: "El usuario no tiene productos en su wishlist.",
        products: [],
      };
    }

    // Devuelve los productos en la wishlist con los detalles adicionales
    return {
      error: false,
      response: "Wishlist obtenida con éxito.",
      products: wishlist.Products, // Incluye los productos con sus detalles asociados
    };
  } catch (error) {
    return {
      error: true,
      response: "Ocurrió un error al obtener la wishlist.",
    };
  }
};


module.exports = {
  wishlistController,
  getWishlistController,
};
