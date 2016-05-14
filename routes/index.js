var express = require('express');
var pgp = require('pg-promise')();
var router = express.Router();
var connectionOptions = {
  host: 'localhost',
  port: 5432,
  database: 'url_shortener_db',
  user: 'postgres',
  password: 'postgres'
};

var db = pgp(connectionOptions);
/* GET home page. */
router.get('/', function(req, res, next) {
  // Initial test to confirm connection to database

  /*
  db.any("SELECT * FROM url_short;")
      .then(function(data) {
        console.log("DATA: ", data);
      })
      .catch(function(error){
        console.log("ERROR: ", error);
      });
   */
  res.render('index', { title: 'Express' });
});

module.exports = router;
