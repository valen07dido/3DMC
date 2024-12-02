const {
  Cart,
  Product,
  ProductCart,
  ProductImage,
  ProductStock,
  ProductCategory,
  ProductType,
  User,
} = require("../../db");
const nodemailer = require("nodemailer");
const email = process.env.EMAIL;
const emailReceiver = process.env.EMAIL_RECEIVER;
const { Op } = require("sequelize");

// Configuración de Nodemailer para el envío de correos
const transporter = nodemailer.createTransport({
  service: "gmail", // O el servicio que utilices
  auth: {
    user: email, // El correo desde el cual se enviarán los emails
    pass: process.env.PASSWORD, // La contraseña o token de aplicación
  },
});

const getCartController = async (UserId) => {
  const cart = await Cart.findOne({
    where: { UserId },
    include: {
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
      ],
      through: {
        model: ProductCart,
        attributes: ["quantity"],
      },
    },
  });

  // Si no existe carrito, crear un carrito vacío con la estructura especificada
  if (!cart) {
    return {
      id: "19fbab07-8a2a-479e-a000-71d27b79d77b", // Puedes generar un UUID dinámico si es necesario
      date: null,
      state: "inicializado",
      cartTotal: null,
      createdAt: new Date().toISOString(), // Fecha actual
      updatedAt: new Date().toISOString(), // Fecha actual
      UserId, // ID del usuario que se pasa como parámetro
      Products: [],
    };
  }

  return cart;
};

const addCartController = async (productId, quantity, UserId) => {
  let cart = await Cart.findOne({ where: { UserId } });
  if (!cart) {
    cart = await Cart.create({ UserId, state: "inicializado" });
  }

  const product = await Product.findByPk(productId);
  if (!product) return { error: true, response: "Producto no encontrado" };

  const [productCart, created] = await ProductCart.findOrCreate({
    where: { CartId: cart.id, ProductId: productId },
    defaults: { quantity },
  });

  if (!created) {
    productCart.quantity += quantity;
    await productCart.save();
  }

  return cart;
};

const updateCartItemController = async (productId, quantity, UserId) => {
  const cart = await Cart.findOne({ where: { UserId } });
  if (!cart) return { error: true, response: "Carrito no encontrado" };

  const productCart = await ProductCart.findOne({
    where: { CartId: cart.id, ProductId: productId },
  });
  if (!productCart) return { error: true, response: "Producto no encontrado" };

  productCart.quantity = quantity;
  await productCart.save();

  return productCart;
};

const removeFromCartController = async (productId, UserId) => {
  const cart = await Cart.findOne({ where: { UserId } });
  if (!cart) return { error: true, response: "Carrito no encontrado" };
  const productCart = await ProductCart.findOne({
    where: { CartId: cart.id, ProductId: productId },
  });
  if (!productCart) return { error: true, response: "Producto no encontrado" };
  await productCart.destroy();
  return {
    delete: true,
    response: "Producto eliminado del carrito correctamente",
  };
};

// Función para enviar el email cuando el carrito está pendiente por 24 horas
const sendPendingCartEmail = async (pendingCarts) => {
  let messageBody = "Lista de carritos pendientes:\n\n";

  for (const cart of pendingCarts) {
    const { User, Products } = cart;

    const productList = Products.map((product) => {
      const productCart = product.ProductCart || {}; // Asegúrate de que estás accediendo a ProductCart
      return `${product.name}: ${productCart.quantity} unidades`;
    }).join("\n");

    messageBody += `Cliente: ${User.name} (${User.email})\nProductos:\n${productList}\n\n`;
  }

  // Configurar y enviar el correo
  await transporter.sendMail({
    from: `"Posibilidad de oferta!!" <${email}>`, // De donde se envía
    to: emailReceiver, // A la distribuidora
    subject: `Carritos pendientes de clientes`, // Asunto del email
    text: messageBody, // Cuerpo del correo con la lista de carritos
  });

  console.log(`Correo enviado con todos los carritos pendientes.`);
};

const checkPendingCartsAndSendEmail = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingCarts = await Cart.findAll({
      where: {
        state: "inicializado",
        updatedAt: {
          [Op.lt]: twentyFourHoursAgo,
        },
      },
      include: [
        {
          model: Product,
          through: {
            model: ProductCart,
            attributes: ["quantity"],
          },
          include: [{ model: ProductImage, attributes: ["address"] }],
        },
        { model: User, attributes: ["name", "email"] },
      ],
    });

    // Si no hay carritos pendientes, terminamos
    if (!pendingCarts.length) {
      console.log("No hay carritos pendientes para enviar.");
      return;
    }

    // Enviar un solo correo con todos los carritos pendientes
    await sendPendingCartEmail(pendingCarts);
  } catch (error) {
    console.error("Error al enviar correos de carritos pendientes:", error);
  }
};

const updateCartStateController = async (cartId) => {
  try {
    const cart = await Cart.findByPk(cartId);
    if (!cart) return { error: true, response: "Carrito no encontrado" };

    cart.state = "finalizado";
    await cart.save();

    // Eliminar el carrito después de marcarlo como finalizado
    await Cart.destroy({ where: { id: cartId } });

    return { success: true, response: "Carrito finalizado y eliminado" };
  } catch (error) {
    console.error("Error al actualizar/eliminar el carrito:", error);
    return { error: true, response: "Error al actualizar/eliminar el carrito" };
  }
};
const getAllCartsController = async () => {
  const carts = await Cart.findAll({
    include: [
      {
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
        ],
        through: {
          model: ProductCart,
          attributes: ["quantity"],
        },
      },
      {
        model: User,
        attributes: ["name", "email"],
      },
    ],
  });

  if (!carts || carts.length === 0) {
    return { error: true, response: "Lista de Carritos vacía." };
  }

  // Formatear la respuesta para que los productos se devuelvan de manera similar a una consulta individual
  const formattedCarts = carts.map((cart) => {
    return {
      id: cart.id,
      state: cart.state,
      updatedAt: cart.updatedAt,
      user: {
        name: cart.User.name,
        email: cart.User.email,
      },
      products: cart.Products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.ProductCart.quantity, // cantidad del producto en el carrito
        images: product.ProductImages.map((image) => image.address),
        stock: product.ProductStock.amount,
        categories: product.ProductCategories.map((category) => category.name),
        types: product.ProductTypes.map((type) => type.name),
      })),
    };
  });

  return formattedCarts; // Devolver los carritos formateados
};

module.exports = {
  getCartController,
  addCartController,
  updateCartItemController,
  removeFromCartController,
  sendPendingCartEmail,
  checkPendingCartsAndSendEmail,
  updateCartStateController,
  getAllCartsController,
};
