var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(__dirname + '/plain.html');
    res.sendFile('views/firewatch.html', { root: '.' });
    // res.render('index', { title: 'Firewatch' });
});

module.exports = router;