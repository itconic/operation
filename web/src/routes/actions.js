var express = require('express');
var router = express.Router();
var async_request = require('request');
var sleep = require('sleep');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var url="http://52.67.11.62:8081/actions?cliente=Yoigo"
    console.log(url)
    async_request.get(url,function (error, response, body) {
        res.json(JSON.parse(body))
    });
});

module.exports = router;
