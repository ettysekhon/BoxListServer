const r = require('rethinkdb');
const config = require('./config');

/* eslint-disable consistent-return */
exports.getOrders = (req, res, next) => {
  r.connect({
    host: config.host,
    port: config.port,
    db: config.db
  }, (connErr, conn) => {
    if (connErr) {
      return next(connErr);
    }

    const connection = conn;

    r.table('order')
      .run(connection, (err, cursor) => {
        if (err) {
          return next(err);
        }
        cursor.toArray((e, result) => {
          if (e) {
            return next(e);
          }
          res.json({
            payload: {
              orders: result
            }
          });
        });
      });
  });
};

exports.postOrder = (req, res, next) => {
  r.connect({
    host: config.host,
    port: config.port,
    db: config.db
  }, (connErr, conn) => {
    if (connErr) {
      return next(connErr);
    }

    const connection = conn;

    r.table('order')
      .insert(req.body)
      .run(connection, (err, result) => {
        if (err) {
          return next(err);
        }
        res.json({
          payload: {
            order: result
          }
        });
      });
  });
};

exports.getProducts = (req, res, next) => {
  r.connect({
    host: config.host,
    port: config.port,
    db: config.db
  }, (connErr, conn) => {
    if (connErr) {
      return next(connErr);
    }

    const connection = conn;

    r.table('product')
      .filter(r.row('parentCategory').eq('OFFERS'))
      .run(connection, (err, cursor) => {
        if (err) {
          return next(err);
        }
        cursor.toArray((e, result) => {
          if (e) {
            return next(e);
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
/* eslint-enable consistent-return */
