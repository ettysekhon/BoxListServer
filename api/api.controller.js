const r = require('rethinkdb');
/* eslint-disable no-unused-vars */
exports.get = (req, res, next) => {
/* eslint-enable no-unused-vars */
  r.connect({ host: '188.166.151.40', port: 28015, db: 'boxlist' }, (connErr, conn) => {
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
