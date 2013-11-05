var podcatcher = require('./podcatcher');
var feeds = {
  baeltestedet: 'http://arkiv.radio24syv.dk/audiopodcast/channel/8741566',
  elektronista: 'http://arkiv.radio24syv.dk/audiopodcast/channel/3843152',
  harddisken:   'http://podcast.dr.dk/p1/rssfeed/harddisken.xml',
  harmontown:   'http://castmate.fm/feed.php?u=harmontownpodcast',
  montecarlo:   'http://podcast.dr.dk/p3/rssfeed/monte_carlo.xml',
  tuxradar:     'http://tuxradar.com/files/podcast/podcast_ogg.rss'
}

//podcatcher.putToDB('elektronista', feeds.elektronista, function(err, res) {
//  if (err) console.log(err);
//  else console.log(res);
//});

//podcatcher.getDB(function(err, res) {
//  if (err) console.log(err);
//  else console.log(res);
//});

//podcatcher.getFromDB('harddisken', function(err, res) {
//  if (err) console.log(err);
//  else console.log(res);
//});
