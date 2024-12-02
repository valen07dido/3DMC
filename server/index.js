const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const cron = require("node-cron");
const { checkPendingCartsAndSendEmail } = require("./src/controllers/productControllers/cartController.js");
const PORT = 3001;

conn.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log(
      `Server listening at ${PORT}, running on ${process.env.NODE_ENV.toUpperCase()}_DB environment`
    ); // eslint-disable-line no-console
  });

  // Configuración del cron job para ejecutar cada 24 horas
  cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando tarea de verificación de carritos pendientes...');
    await checkPendingCartsAndSendEmail(); // Esta función se encargará de revisar los carritos y enviar el email
  });
});
