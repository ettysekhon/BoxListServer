module.exports = {
  /* eslint-disable no-process-env */
  host: process.env.RDB_HOST || 'rethinkdb-db',
  port: parseInt(process.env.RDB_PORT, 10) || 28015,
  db: process.env.RDB_DB || 'boxlist'
  /* eslint-enable no-process-env */
};
