var podcatcher = require('./podcatcher');
var level = require('level');
var db = level('db')
var urls = {
  baeltestedet: 'http://arkiv.radio24syv.dk/audiopodcast/channel/8741566',
  elektronista: 'http://arkiv.radio24syv.dk/audiopodcast/channel/3843152',
  harddisken: 'http://podcast.dr.dk/p1/rssfeed/harddisken.xml',
  harmontown: 'http://www.castmate.fm/feed.php?u=harmontownpodcast',
  montecarlo: 'http://podcast.dr.dk/p3/rssfeed/monte_carlo.xml',
  tuxradar: 'http://www.tuxradar.com/files/podcast/podcast_ogg.rss'
}

function prepBatch(feedObj, cb) {
  var setup = [];
  for (x in feedObj) {
    setup.push({type:'put',key:x,value:feedObj[x]});
  }
  if (setup.length == 0) return cb(new Error('Error creating batch staging array.'));
  cb(null, setup);
}

function runBatch(setupArr, cb) {
  db.batch(setupArr, function(err) {
    if (err) return cb(err);
    return cb(null);
  })
}

function client(cb) {
  var res = [];
  db.createReadStream().on('data', function(data) {
    res.push(data);
  }).on('error', function(err) {
    return cb(err);
  }).on('end', function() {
    return cb(null, res);
  })
}

client.getAll = client;
client.prepBatch = prepBatch;
client.runBatch = runBatch;
module.exports = client;
