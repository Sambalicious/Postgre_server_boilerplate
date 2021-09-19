var util = require('util');
var winston = require('winston');
var pg = require('pg');
var url = require('url');
var _ = require('lodash');

_timestamp = function () {
  return new Date().toISOString();
};

var Postgres = exports.Postgres = function (options) {
    options = options || {};

    this.timestamp   = typeof options.timestamp !== 'undefined' ? options.timestamp : false;

    if(options.connectionString || "" != "") {
      var params = url.parse(options.connectionString);
      var auth = params.auth.split(':');

      this.config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: (options.ssl === false) ? false : true,
        max: 10, // max number of clients in pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
      };
    } else {
      throw new Error("Postgres transport requires \"connectionString\".");
    }

    if(options.tableName || options.databaseFunction || "" != "") {
      this.sql = options.tableName
        ? "INSERT INTO " + options.tableName + " (level, message, meta) values ($1, $2, $3)"
        : "SELECT " + options.databaseFunction + "($1, $2, $3)";
    } else {
      throw new Error("Postgres transport requires \"tableName\" or \"databaseFunction\".");
    }

    this.ignoreMessage = options.ignoreMessage || function() { return false; };

    // Winston Options
    this.name  = 'postgres';
    this.level = options.level || 'info';

    // create the Postgres instance
    this.pool = new pg.Pool(this.config);
};

util.inherits(Postgres, winston.Transport);

Postgres.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    // should we skip this log message
    if (this.ignoreMessage(level, msg, meta)) {
      return callback(null, true);
    }

    var timestampFn = typeof this.timestamp === 'function'
          ? this.timestamp
          : _timestamp,
        timestamp = this.timestamp ? timestampFn() : undefined;

    if (meta) {
      meta = _.cloneDeep(meta);
      meta.timestamp = timestamp;
    }

    // use connection pool
    this.pool.connect(function(err, client, done) {

        // fetching a connection from the pool, emit error if failed.
        if (err) {
            console.log(err);
            self.emit("error", err);
        }

        client.query(self.sql, [level, msg, meta instanceof Array ? JSON.stringify(meta) : meta], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            // executing statement, emit error if failed.
            if(err) {
                self.emit("error", err);
            }

            // acknowledge successful logging event
            self.emit("logged");
        });
    });

    // intially, tell the caller that everything was fine
    callback(null, true);
};

//
// Add Postgres to the transports defined by winston.
//
winston.transports.Postgres = Postgres;
