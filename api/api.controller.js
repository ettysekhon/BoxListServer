const r = require('rethinkdb');
const config = require('./config');
/* eslint-disable no-unused-vars */
exports.get = (req, res, next) => {
/* eslint-enable no-unused-vars */
  r.connect({
    host: config.host,
    port: config.port,
    db: config.db
  }, (connErr, conn) => {
    if (connErr) {
      throw connErr;
    }

    const connection = conn;

    r.table('product').run(connection, (err, cursor) => {
      if (err) {
        throw err;
      }
      cursor.toArray((e, result) => {
        if (e) {
          throw e;
        }
        res.json({
          payload: {
            products: result
          }
        });
      });
    });
  });
};
