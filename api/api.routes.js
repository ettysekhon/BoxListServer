const router = require('express').Router();
const controller = require('./api.controller.js');

router.route('/product')
  .get(controller.getProducts);

router.route('/order')
  .get(controller.getOrders);

router.route('/order')
  .post(controller.postOrder);

module.exports = router;
