'use strict';
/* eslint-disable no-console */
const async = require('async');
const Nightmare = require('nightmare');
const fs = require('fs');
const jsdom = require('jsdom').jsdom;
const window = jsdom().defaultView;
const $ = require('jquery')(window);
const USERNAME_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#button';
const CATEGORY_LINK_SELECTOR = 'ul.goo-collapsible';
const LOGIN_URL = 'http://www.halladeys.co.uk/login.php';
const USERNAME = 'TEST2';
const PASSWORD = 'test2passw';
const DEBUG = false;
const DELAY = 60 * 60000;

const saveContents = (fileName, contents) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(contents, 2, 0), (err) => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const extractLinks = (data) => {
  const items = $(data).filter('li.dropdown');
  const categories = $(items).map((index, item) => {
    const links = $('li', item);
    const categoryName = $('> a', item).text();
    const categoryLink = $('> a', links.first()).attr('href');
    const subCategories = [];

    $(links).each((i, link) => {
      if (i > 0) {
        const subCategory = $('> a', link);
        const subCategoryName = subCategory.text();
        const subCategoryLink = subCategory.attr('href');
        subCategories.push({
          name: subCategoryName,
          link: subCategoryLink
        });
      }
    });

    return {
      category: {
        name: categoryName,
        link: categoryLink
      },
      subCategories: subCategories
    };
  }).toArray();

  return {categories: categories};
};

const scrape = (nightmare, url, selector, fn) => {
  return new Promise((resolve, reject) => {
    nightmare
    .goto(url)
    .type(USERNAME_SELECTOR, USERNAME)
    .type(PASSWORD_SELECTOR, PASSWORD)
    .click(BUTTON_SELECTOR)
    .wait(5000)
    .evaluate((sel) => {
      const data = $(sel);
      if(data) {
        return data.html();
      }
      return reject('Not in page context');
    }, selector)
    .run((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(fn(data));
      }
    });
  });
};

const scrapeLinks = (nightmare) => {
  return scrape(nightmare, LOGIN_URL, CATEGORY_LINK_SELECTOR, extractLinks);
};

const loadLinks = (data) => {
  let links = [];
  data.map((category) => {
    if(category.subCategories.length > 0) {
      $(category.subCategories).each((index, cat) => {
        links.push(`http://www.halladeys.co.uk/${cat.link}`);
      });
    } else {
      links.push(`http://www.halladeys.co.uk/${category.category.link}`);
    }
  });
  return links;
};

const scrapeProducts = (nightmare, links) => {
  return new Promise((resolve, reject) => {
    let results = {products: []};
    const scrapableLinks = loadLinks(links.categories);

    const q = async.queue(function (website, callback) {
      nightmare
        .goto(website.url)
        .evaluate(function () {
          let localProducts = [];
          /* eslint-disable max-len, one-var */
          let data, category, title, images, el, i, tempInputs, productCode, costPrice, price, discount, parentCategory, createdAt;
          /* eslint-enable max-len, one-var */
          data = $('#MidCol');
          /* eslint-disable max-len */
          category = data.contents().filter(function () {
            return this.nodeType === 3;
          }).text().split('>>>')[1].trim() || '';
          /* eslint-disable max-len */
          el = $('tr', data);
          delete el[el.length-1]; delete el[1]; delete el[1];
          for (i =2; i < el.length-1; i++) {
            title = $('td', el[i])[1].innerHTML;
            /* eslint-disable max-len */
            images = 'http://www.halladeys.co.uk/'+($('.highslide img', el[i]).length > 0 ? $('.highslide img', el[i]).attr('src').replace('/thumbs', '') : 'photo_uploads/thumbs/nopic.png');
            /* eslint-disable max-len */
            tempInputs= $(el[i]).nextUntil('tr');
            productCode = tempInputs.filter('input[name=prodCode\\[\\]]').val();
            costPrice = tempInputs.filter('input[name=cost1\\[\\]]').val();
            price = tempInputs.filter('input[name=price\\[\\]]').val();
            discount = tempInputs.filter('input[name=discount\\[\\]]').val();
            parentCategory = tempInputs.filter('input[name=sort\\[\\]]').val();
            createdAt = new Date();
            localProducts.push({ title, productCode, price, costPrice, discount, category, parentCategory, images, createdAt });
          }

          return localProducts;
        })
        .then(function (data) {
          results.products = results.products.concat(data);
          callback(false, website.url);
        })
        .catch(function (err) {
          console.error(err);
          callback(err, 0);
          reject(err);
        });
    }, 1);

    q.drain = () => {
      resolve(results);
    };

    scrapableLinks.forEach((url) => {
      q.push({
        url: url
      }, () => {
        console.log(`Finished processing: ${url}`);
      });
    });
  });
};

const run = (path) => {
  const nightmare = DEBUG
    ? Nightmare({show: true, openDevTools: { detach: true } })
    : Nightmare();
  const timestamp = Date.now();
  const productsFileName = `${path}products_${timestamp}.json`;
  console.log(`running scrape at ${new Date()} saving file to ${productsFileName}`);
  return scrapeLinks(nightmare)
  .then((links) => {
    console.log('scraping products');
    return scrapeProducts(nightmare, links);
  })
  .then((products) => {
    console.log('saving products', products);
    saveContents(productsFileName, products);
  })
  .then(() => {
    console.log('ending the nightmare!');
    return nightmare.end();
  })
  .catch((err) => {
    nightmare.end();
    throw err;
  });
};

module.exports.start = (path) => {
  let running = true;
  run(path)
  .then(() => {
    running = false;
    console.log('scrape successful');
  })
  .catch((err)=>{
    running = false;
    console.log('scrape error', err);
  });

  setInterval(() => {
    console.log('attempting to re-scrape');
    if (!running) {
      running = true;
      run()
      .then(() => {
        running = false;
        console.log('re-scrape successful');
      })
      .catch((err)=>{
        running = false;
        console.log('error re-scraping', err);
      });
    }
  }, DELAY);
};
/* eslint-enable no-console */
