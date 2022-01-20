var Postgres = require("winston-postgres").Postgres;

const winston = require("winston-transport-pg");

module.exports = function () {
  winston.add(winston.transports.Postgres, {
    ssl: false, // are you sure you want to do this?
    timestamp: true,
    connectionString: "postgres://USER:admin@localhost:5432/api",
    tableName: "winston-logs",
    ignoreMessage: function (level, message, metadata) {
      if (message === "something to ignore") {
        return true;
      }
      return false;
    },
  });
};
