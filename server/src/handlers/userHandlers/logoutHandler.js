// handlers/userHandlers/logoutHandler.js
const { logoutUser } = require("../../controllers/userControllers/logoutController");

// Handler para cerrar sesión
const logoutHandler = async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: true, message: "Token no proporcionado." });
  }

  try {
    const result = await logoutUser(token);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { logoutHandler };
