const r = require('rethinkdb');
const config = require('./config');
  /* eslint-disable no-console */
const createDatabase = () => {
  return new Promise((resolve, reject) => {
    r.connect({host: config.host, port: config.port }, (err, conn) => {
      if (err) {
        reject(err);
      }
      r.dbCreate(config.db)
        .run(conn, (error, result) => {
          if (error) {
            console.log(`RethinkDB database ${config.db} already exists`);
            resolve(error);
          } else {
            console.log(`RethinkDB database ${config.db} created`);
            resolve(result);
          }
        });
    });
  });
};

const createTable = (table) => {
  return new Promise((resolve, reject) => {
    r.connect({host: config.host, port: config.port }, (err, conn) => {
      if (err) {
        reject(err);
      }
      r.db(config.db).tableCreate(table)
        .run(conn, (error, result) => {
          if (error) {
            console.log(`RethinkDB table ${table} already exists`);
            resolve(error);
          } else {
            console.log(`RethinkDB table ${table} created`);
            resolve(result);
          }
        });
    });
  });
};

createDatabase()
.then(() => {
  return Promise.all(config.tables.map(createTable));
})
.then(() => {
  console.log('RethinkDB database setup');
})
.catch((err) => {
  console.log('error setting up RethinkDB database', err);
});
/* eslint-enable no-console */
