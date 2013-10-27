var level = require('level');
var db = level('../db', {valueEncoding: 'json'});

var feedDB = function(cb) {
  var res = [];
  db.createReadStream()
    .on('error', function(err) {
      return cb(err);
    })
    .on('data', function(data) {
      res.push(data);
    })
    .on('end', function() {
      return cb(res);
    });
}

feedDB.get = function(prop, cb) {
  db.get(prop, function(err, val) {
    if (err) return cb(err);
    if (val) return cb(null, val);
  })
}

feedDB.save = function(key, val, cb) {
  db.put(key, val, function(err) {
    if (err) return cb(err);
    return cb(null);
  })
}



module.exports = feedDB;
