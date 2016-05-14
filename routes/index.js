var express = require('express');
var validator = require('validator');
var pgp = require('pg-promise')();
var router = express.Router();
var connectionOptions = {
  host: 'localhost',
  port: 5432,
  database: 'url_shortener_db',
  user: 'postgres',
  password: 'postgres'
};

var logError = function(error) {
  console.log("ERROR: ", error);
};

// Generates a short-url in form of 6 random letters of alphabet.
var randGen = function() {
  var shortened = "";
  for(var i = 0; i < 6; i++) {
    shortened += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
  }
  return shortened;
};

var db = pgp(connectionOptions);

/* GET home page. */
router.get("/", function(req, res, next){
  res.json({error: "Enter a valid or a short URL"});
});

// Shortens a valid URL or redirects if a valid short URL is passed.
// Responds with original and short url or an error, in JSON format.
router.get("/:value([\\S]+)", function(req, res, next) {

  var param = req.params.value;
  console.log('param: ', param);
  if(validator.isURL(param, {require_protocol: true})) {
    db.any("SELECT shortened FROM url_short WHERE original=$1", param)
        .then(function(data){

          if(data.length > 0) {
            res.json({original: param, short_url: data[0].shortened});
          } else {
            var shortened = randGen();
            db.none("INSERT INTO url_short(original, shortened) VALUES($1, $2)", [param, shortened])
                .then(function() {
                  res.json({original: param, short_url: shortened});
                })
                .catch(function(error) {
                  logError(error);
                });
          }
        })
        .catch(function(error){
          logError(error);
        });
  } else {
    db.any("SELECT original FROM url_short WHERE shortened=$1", param)
        .then(function (data) {

          if (data.length > 0){
            res.redirect(data[0].original);
            console.log("Original URL: ", data[0].original);
          } else {
            res.json({error: "Wrong URL format, please make sure both the protocol and address are valid."});
          }
        })
        .catch(function (error) {
          logError(error);
        });
  }
});

module.exports = router;
