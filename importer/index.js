'use strict';
/* eslint-disable no-console */
const fs = require('fs');
const r = require('rethinkdb');
const path = require('path');
const _ = require('lodash');

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

const deleteFile = (fullPathFile) => {
  fs.unlink(fullPathFile, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log('file deleted successfully', fullPathFile);
    return;
  });
};

const importData = (fullPathFile) => {
  return new Promise((resolve, reject) => {
    console.log('connecting to db');
    r.connect({host: 'rethinkdb-db', port: 28015}, (err, conn) => {
      if (err) {
        console.log('db connect error', err);
        reject(err);
      }

      const connection = conn;

      // delete products
      r.table('products').delete().run(connection, (error, result) => {
        if (error) {
          console.log('delete products error', error);
          reject(error);
        }
        console.log('deleted products', JSON.stringify(result, null, 2));
      });

      console.log('importing data');
      const products = JSON.parse(fs.readFileSync(fullPathFile, 'utf8'));
      const results =
        products && products.products && products.products.length > 0
        ? products.products
        : false;

      // insert products
      r.table('products').insert(results).run(connection, (error, result) => {
        if (error) {
          console.log('insert products error', error);
          reject(error);
        }
        console.log('inserted products', JSON.stringify(result, null, 2));
        resolve();
      });
    });
  });
};

const importLatestFile = () => {
  const dir = path.join(__dirname, 'files');
  const latestFile = findLatestFile('products', dir);
  if (!latestFile) {
    return console.log(`no file found in dir ${dir}`);
  }
  const fullPathFile = `${dir}/${latestFile}`;
  console.log('fullPathFile', fullPathFile);

  fs.stat(fullPathFile, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // import the data
    importData(fullPathFile)
      .then(() => {
        deleteFile(fullPathFile);
      })
      .catch((error) => {
        console.log('error', error);
        deleteFile(fullPathFile);
      });
  });
  return null;
};

setInterval(() => {
  importLatestFile();
}, 1000);
/* eslint-enable no-console */
