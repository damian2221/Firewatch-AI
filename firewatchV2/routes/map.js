var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile('views/map.html', { root: '.' });
});

module.exports = router;