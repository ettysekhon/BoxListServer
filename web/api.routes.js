const router = require('express').Router();

router.route('/')
  .get((req, res) => {
    res.send('web app');
  });

module.exports = router;
