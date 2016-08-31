const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./api.routes');
/* eslint-disable no-process-env */
const port = process.env.PORT || 3000;
/* eslint-enable no-process-env */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup api routes
app.use('/api', routes);

// route not found
app.use((req, res) => {
  /* eslint-disable no-console */
  console.log(`route not found for ${req.url}`);
  res.status(404).send('Sorry cant find that!');
});

// error logging middleware
app.use((err, req, res, next) => {
  console.log(JSON.stringify(err, null, 2));
  next(err);
});

app.use((err, req, res) => {
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log('Starting application on port %d', port);
  /* eslint-enable no-console */
});
