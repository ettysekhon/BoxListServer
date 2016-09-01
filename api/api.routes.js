const router = require('express').Router();
const controller = require('./api.controller.js');

router.route('/')
  .get(controller.get);

module.exports = router;
