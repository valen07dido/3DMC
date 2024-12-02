const cloudinary = require("cloudinary").v2;
const path = require("path");

// Función para probar la subida
const uploadTestImage = async () => {
  try {
    const imagePath = path.join(__dirname, "../../../client/public/imagenes/banner-deleita.jpg"); // Ruta de la imagen
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "LaMerced/productos/test",
    });
    console.log("Imagen subida:", result.secure_url);
  } catch (error) {
    console.error("Error al subir la imagen:", error.message); // Imprimir el mensaje de error
  }
};

uploadTestImage();
