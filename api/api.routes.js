const router = require('express').Router();
const controller = require('./api.controller');

router.route('/')
  .get(controller.get);

module.exports = router;
