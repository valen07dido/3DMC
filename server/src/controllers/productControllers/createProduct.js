const cloudinary = require("cloudinary").v2;
const {
  Product,
  ProductCategory,
  ProductType,
  ProductImage,
  ProductStock,
} = require("../../db");

const createProduct = async ({
  name,
  description,
  categoryName,
  typeName,
  images, // Array de strings (URLs de imágenes)
  stock,
  ingredients,
  composition,
  feedingGuide,
  priceCategory
}) => {
  // Configura Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Verifica que los campos requeridos estén presentes
  if (!name || !description || !ingredients || !composition || !feedingGuide) {
    return {
      error: true,
      response: "Faltan campos requeridos.",
    };
  }

  try {
    // Verifica si el producto ya existe
    const existingProduct = await Product.findOne({ where: { name } });
    if (existingProduct) {
      return {
        error: true,
        response: "El producto ya existe",
      };
    }

    // Crea o busca la categoría y tipo
    const [category] = await ProductCategory.findOrCreate({
      where: { name: categoryName },
    });
    const [type] = await ProductType.findOrCreate({
      where: { name: typeName },
    });

    // Subir imágenes a Cloudinary y guardar las URLs en la base de datos
    const productImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            folder: `LaMerced/productos/${name
              .replace(/\s+/g, "_")
              .toLowerCase()}`, // Carpeta en Cloudinary
            overwrite: true, // Permite sobrescribir la imagen si ya existe
            transformation: [
              { width: 2126, height: 2126, crop: "fill" },
              { quality: 35 },
              { fetch_format: "auto" },
            ],
          });
          productImages.push({ address: uploadResult.secure_url }); // Guarda la URL de la imagen
        } catch (uploadError) {
          console.error(`Error subiendo imagen:`, uploadError.message);
          return {
            error: true,
            response: "Fallo al cargar las imágenes",
          };
        }
      }
    } else {
      return {
        error: true,
        response: "No se proporcionaron imágenes para el producto.",
      };
    }

    // Crea el nuevo producto
    const newProduct = await Product.create({
      name,
      description,
      ingredients,
      composition,
      feedingGuide,
      priceCategory
    });

    // Relaciona el producto con la categoría y tipo
    await newProduct.addProductCategory(category);
    await newProduct.addProductType(type);

    // Guarda todas las imágenes asociadas al producto en la base de datos
    const imagePromises = productImages.map((img, index) => {
      return ProductImage.create({
        address: img.address,
        position: index,
        ProductId: newProduct.id,
      });
    });

    await Promise.all(imagePromises);

    // Crea el stock del producto si se proporciona
    if (stock) {
      await ProductStock.create({
        amount: stock,
        ProductId: newProduct.id,
      });
    }

    return newProduct; // Retorna el producto creado
  } catch (error) {
    console.error("Error en la creación del producto:", error.message);
    return {
      error: true,
      response: error.message || "Algo falló!",
    };
  }
};

module.exports = createProduct;
