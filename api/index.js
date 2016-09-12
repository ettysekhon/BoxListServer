/* eslint-disable no-process-env */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./api.routes');
const port = process.env.PORT || 8082;

const isDomainWhiteLited = (origin, host) => {
  const whiteListDomains = [`localhost:${port}`];
  return whiteListDomains.indexOf(origin) || whiteListDomains.indexOf(host) !== -1
      ? origin || host
      : null;
};

const allowCrossDomain = (req, res, next) => {
  const domain = isDomainWhiteLited(req.headers.origin, req.headers.host);
  if (domain) {
    res.header('Access-Control-Allow-Origin', domain);
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST,PUT,DELETE,GET,OPTIONS');
    next();
  } else {
    res.sendStatus(401);
  }
};

// see http://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup api routes
app.use('/api', routes);

// route not found
app.use((req, res) => {
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

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`Starting application on port ${port}`);
  }
});

/* eslint-enable no-console */
/* eslint-enable no-process-env */
