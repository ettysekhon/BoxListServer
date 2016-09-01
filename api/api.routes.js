const router = require('express').Router();

router.route('/')
  .get((req, res) => {
    res.send('api app');
  });

module.exports = router;
