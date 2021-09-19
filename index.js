require("dotenv").config();
const app = require("express")();
const { sequelize } = require("./models");
const winston = require("winston");
//require("./start/logging")();
//require("./startup/db")();
require("./start/routes")(app);

// note the order  log errors first > connect to database > routes

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  try {
    winston.info("app is listening on port:" + port);
    console.log("listening on port " + port);
    await sequelize.authenticate(); // .sync({force: true}) drop database if it already exist
    console.log("database connected");
  } catch (error) {
    console.log(error.message);
  }
});
