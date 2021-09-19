# Postgres Transport for Winston

The winston-postgres module allows you to log your winston messages to a postgresql db.

    var Postgres = require('winston-postgres').Postgres;

    winston.add(winston.transports.Postgres, {
      ssl: false, // are you sure you want to do this?
      timestamp: true,
      connectionString: 'postgres://admin:admin@localhost:5432/api',
      tableName: 'winston-logs',
      ignoreMessage: function(level, message, metadata) {
        if (message === 'something to ignore') {
          return true;
        }
        return false;
      }
    });

## Installation

``` bash
  $ npm install winston-postgres
```

## Usage

winston-postgres is just like any other transport for winston. When adding it to winston, it takes some options so that
it knows where to log to postgres.

The postgres transport takes the following options:

    ssl: boolean to decide whether to disable ssl-secured db connection
    timestamp: boolean to decide whether to attach timestamp field to metadata (if metadata is null, no timestamp is attached)
    connectionString: the db connection uri
    databaseFunction: the name of a database function accepting 3 arguments (level, message, metadata)
    tableName: the table (with columns 'level', 'message', 'metadata') to which to log
    ignoreMessage: (optional) a function of signature (level, message, metadata) -> boolean which can be used to determine whether to ignore a log message

One of 'tableName' and 'databaseFunction' must be present.
