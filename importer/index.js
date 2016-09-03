'use strict';
/* eslint-disable no-console */
const fs = require('fs');
const r = require('rethinkdb');
const path = require('path');
const _ = require('lodash');
const config = require('./config');

const findLatestFile = (match, dirpath) => {
  const matchedFiles = fs.readdirSync(dirpath);
  const files = _.remove(matchedFiles, (file) => {
    return file.match(match);
  });
  const latestFile = _.max(files, (file) => {
    const fullpath = path.join(dirpath, file);
    return fs.statSync(fullpath).ctime;
  });
  return latestFile;
};

const addProcessedFile = (processedFiles, file) => {
  processedFiles[file] = true;
};

const isProcessed = (processedFiles, file) => {
  return processedFiles[file] || false;
};

const importData = (fullPathFile) => {
  return new Promise((resolve, reject) => {
    console.log('connecting to db');
    r.connect({host: config.host, port: config.port, db: config.db }, (err, conn) => {
      if (err) {
        console.log('db connect error');
        reject(err);
      }

      const connection = conn;

      // delete products
      r.table('product').delete().run(connection, (error) => {
        if (error) {
          console.log('delete products error');
          reject(error);
        }
        console.log('deleted product data');
      });

      console.log('importing data', fullPathFile);
      const products = JSON.parse(fs.readFileSync(fullPathFile, 'utf8'));
      const results =
        products && products.products && products.products.length > 0
        ? products.products
        : false;

      // insert products
      r.table('product').insert(results).run(connection, (error) => {
        if (error) {
          console.log('insert products error');
          reject(error);
        }
        console.log('inserted product data');
        resolve();
      });
    });
  });
};

const importLatestFile = (processedFiles) => {
  const dir = path.join(__dirname, 'files');
  const latestFile = findLatestFile('products', dir);
  if (!latestFile || isProcessed(processedFiles, latestFile)) {
    return console.log(`no file found in dir ${dir}`);
  }
  const fullPathFile = `${dir}/${latestFile}`;
  console.log('fullPathFile', fullPathFile);

  fs.stat(fullPathFile, (err) => {
    if (err) {
      console.error('fs stat error');
      return;
    }

    // import the data
    importData(fullPathFile)
      .then(() => {
        console.log('successfully imported data');
        addProcessedFile(processedFiles, latestFile);
      })
      .catch(() => {
        console.log('error importing data');
        addProcessedFile(processedFiles, latestFile);
      });
  });
  return null;
};

const run = () => {
  const processedFiles = {};
  setInterval(() => {
    importLatestFile(processedFiles);
  }, 10000);
};

run();
/* eslint-enable no-console */
