require("dotenv").config();
const database = process.env.DATABASE;

const { Sequelize } = require("sequelize");
// Importar modelos
const UserModel = require("./models/userModels/User");
const UserCredentialModel = require("./models/userModels/UserCredential");
const UserRoleModel = require("./models/userModels/UserRole");
const WishlistProductModel = require("./models/productModels/wishlistProduct");
const ProductModel = require("./models/productModels/Product");
const CartModel = require("./models/productModels/Cart");
const WishlistModel = require("./models/productModels/Wishlist");
const ProductCartModel = require("./models/productModels/ProductCart");
const ProductImageModel = require("./models/productModels/ProductImage");
const ProductStockModel = require("./models/productModels/ProductStock");
const ProductCategoryModel = require("./models/productModels/ProductCategory");
const BlackListedTokensModel = require("./models/blackListTokenModel");
const blackListTokenModel = require("./models/blackListTokenModel");
const productTypeModel = require("./models/productModels/ProductType");

// Inicialización de Sequelize
const sequelize = new Sequelize(database, {
  logging: false,
  native: false,
});

// Inicializar modelos
const User = UserModel(sequelize);
const UserCredentials = UserCredentialModel(sequelize);
const UserRole = UserRoleModel(sequelize);
const Product = ProductModel(sequelize);
const Cart = CartModel(sequelize);
const WishList = WishlistModel(sequelize);
const ProductCart = ProductCartModel(sequelize);
const ProductImage = ProductImageModel(sequelize);
const ProductStock = ProductStockModel(sequelize);
const ProductCategory = ProductCategoryModel(sequelize);
const BlackListedTokens = blackListTokenModel(sequelize);
const WishlistProduct = WishlistProductModel(sequelize);
const productType = productTypeModel(sequelize);
// Definir relaciones entre modelos
User.hasOne(UserCredentials, { onDelete: "CASCADE" });
UserCredentials.belongsTo(User);

User.belongsTo(UserRole, { foreignKey: "rolId", as: "role" });

Product.belongsToMany(ProductCategory, { through: "ProductProductCategory" });
ProductCategory.belongsToMany(Product, { through: "ProductProductCategory" });

Product.belongsToMany(productType, { through: "ProductProductType" });
productType.belongsToMany(Product, { through: "ProductProductType" });
Product.hasMany(ProductImage, { onDelete: "CASCADE" });
ProductImage.belongsTo(Product);

Product.hasOne(ProductStock, { onDelete: "CASCADE" });
ProductStock.belongsTo(Product);

// Definir relaciones entre modelos
Product.belongsToMany(WishList, { through: WishlistProduct });
WishList.belongsToMany(Product, { through: WishlistProduct });

User.hasOne(WishList, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
WishList.belongsTo(User, {
  foreignKey: "userId",
});

Cart.belongsTo(User);
User.hasOne(Cart);

// Definir relaciones entre modelos
Cart.belongsToMany(Product, { through: ProductCart });
Product.belongsToMany(Cart, { through: ProductCart });

// Agregar la relación de ProductCart con Product
ProductCart.belongsTo(Product, { foreignKey: "ProductId" });
ProductCart.belongsTo(Cart, { foreignKey: "CartId" });


module.exports = {
  ...sequelize.models, // para importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importar la conexión { conn } = require('./db.js');
};
