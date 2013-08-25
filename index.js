var podcatcher = require('./podcatcher');

var callback = function(err, meta) {
  if (err) console.log(err);
  if (meta) console.log('\n' + meta.description + '\n');
}

podcatcher.getByDate('http://feeds.feedburner.com/omgcraftsd', '2013-08-03', callback);