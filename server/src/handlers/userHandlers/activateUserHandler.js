const {
  activateUserController,
} = require("../../controllers/userControllers/activateUserController");

const activateUserHandler = async (req, res) => {
  const { token } = req.params; // Tomamos el token de los params
  try {
    const response = await activateUserController(token);
    if (response.error) {
      return res.status(404).json(response); // Si hay error, devolvemos 404
    }
    res.status(202).json(response); // Si es exitoso, devolvemos 202
  } catch (error) {
    res.status(400).json({ error: true, response: "Oops, algo falló" });
  }
};

module.exports = { activateUserHandler };
