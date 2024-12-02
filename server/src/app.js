require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
var cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const secret = process.env.SECRET_KEY;
const server = express();
const routes = require("./routes/mainRouter");
server.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);
server.use(cors({ credentials: true, origin: `${process.env.FRONTEND_URL}` }));
server.use(morgan("dev"));
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

server.use("/", routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
