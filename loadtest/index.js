'use strict';
/* eslint-disable no-console */
const loadtest = require('../lib/loadtest.js');

const options = {
  url: 'http://yourHost',
  concurrent: 5,
  method: 'POST',
  body: '',
  requestPerSecond: 5,
  maxSeconds: 30,
  requestGenerator(params, opts, client, callback) {
    const message = '{"hi": "ho"}';
    opts.headers['Content-Length'] = message.length;
    opts.headers['Content-Type'] = 'application/json';
    opts.body = 'YourPostData';
    opts.path = 'YourURLPath';
    const request = client(opts, callback);
    request.write(message);
    return request;
  }
};

loadtest.loadTest(options, (error, results) => {
  if (error) {
    return console.error('Got an error: %s', error);
  }
  console.log(results);
  console.log('Tests run successfully');
  return null;
});
/* eslint-enable no-console */
