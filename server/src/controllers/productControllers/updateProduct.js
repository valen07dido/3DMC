const {
  Product,
  ProductImage,
  ProductStock,
  ProductCategory,
} = require("../../db");

const updateProductController = async (id, field, value) => {
  try {
    // Validación del ID
    if (!id) throw new Error("El ID proporcionado no es válido.");

    const item = await Product.findByPk(id);
    if (!item) throw new Error("No encontramos el producto a modificar.");

    switch (field) {
      case "name":
        item.name = value;
        break;
      case "description":
        item.description = value;
        break;
      case "price":
        if (isNaN(value)) {
          return { error: true, response: "El precio debe ser un número." };
        }
        item.price = parseFloat(value);
        break;
      case "image": {
        if (!Array.isArray(value)) {
          return { error: true, response: "El formato de las imágenes es incorrecto." };
        }

        // Eliminación de imágenes actuales y creación de nuevas
        await ProductImage.destroy({ where: { ProductId: id } });
        const imagePromises = value.map((imageUrl) =>
          ProductImage.create({ ProductId: id, address: imageUrl })
        );
        await Promise.all(imagePromises);

        return { message: "Imágenes actualizadas correctamente." };
      }
      case "stock": {
        const stock = await ProductStock.findOne({ where: { ProductId: id } });
        if (stock) {
          stock.amount = value;
          await stock.save();
        } else {
          await ProductStock.create({ ProductId: id, amount: value });
        }
        return { message: "Stock actualizado correctamente." };
      }
      case "category": {
        const category = await ProductCategory.findOne({ where: { name: value } });

        // Creación o actualización de categoría
        if (!category) {
          const newCategory = await ProductCategory.create({ name: value });
          await item.setProductCategories([newCategory]);
        } else {
          await item.setProductCategories([category]);
        }
        return { message: "Categoría actualizada correctamente." };
      }
      case "ingredients":
        item.ingredients = value;
        break;
        case "composition": {
          let compositionArray;
          if (typeof value === "string") {
            compositionArray = JSON.parse(value);
          } else {
            compositionArray = value;
          }
        
          // Verificar si se incluye el campo 'value' en la composición
          compositionArray = compositionArray.map((comp) => {
            if (comp.name === "Valor Energético" && comp.value) {
              return { ...comp, value: comp.value };
            }
            return { name: comp.name, min: comp.min || 0, max: comp.max || 0 };
          });
        
          item.composition = compositionArray;
          break;
        }
      case "feedingGuide":
        item.feedingGuide = value;
        break;
      default:
        return { error: true, response: "Campo de producto no válido para actualizar." };
    }

    await item.save();

    return { message: "Producto actualizado correctamente", item };
  } catch (error) {
    return {
      error: true,
      response: `${error.message}. Error al actualizar el producto.`,
    };
  }
};

module.exports = {
  updateProductController,
};
