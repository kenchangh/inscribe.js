var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'User page',
    pretty: true
  });
});

module.exports = router;
