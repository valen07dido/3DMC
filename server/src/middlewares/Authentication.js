const jwt = require("jsonwebtoken");
const { BlackListedTokens } = require("../db");
const secret = process.env.SECRET_KEY;

async function isAuthenticated(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      error:true,
      response:"Necesita iniciar sesion para entrar"
    });
  }

  const blacklistedToken = await BlackListedTokens.findOne({ where: { token } });

  if (blacklistedToken) {
    return res.status(401).json({
      error:true,
      response:"Token invalido o expirado"
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send("Token inválido o expirado");
    }

    req.user = decoded;
    next();
  });
}

module.exports = { isAuthenticated };
