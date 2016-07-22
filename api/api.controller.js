const r = require('rethinkdb');

exports.get = (req, res, next) => {
  console.log(`making get request at ${new Date()}`);

  r.connect({ host: '188.166.151.40', port: 28015, db: 'boxlist' }, (err, conn) => {
    if (err) throw err;

    const connection = conn;

    r.table('product').run(connection, (err, cursor) => {
      if (err) throw err;
      cursor.toArray(function(err, result) {
          if (err) throw err;
          res.json({
            payload: {
              products: result
            }
          });
      });
    });
  });
};
