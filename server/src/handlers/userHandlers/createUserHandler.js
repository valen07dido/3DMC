
const { createUser } = require("../../controllers/userControllers/createUserController");

const createUserHandler = async (req, res) => {
  try {
    const userData = req.body; // Datos del usuario desde el cuerpo de la solicitud

    const newUser = await createUser(userData);

    // Responder con el usuario creado
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

module.exports = {
  createUserHandler,
  // Otros handlers aquí...
};
