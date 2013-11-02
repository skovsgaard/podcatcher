var app = require('./client');
var feeds = {
  baeltestedet: 'http://arkiv.radio24syv.dk/audiopodcast/channel/8741566',
  elektronista: 'http://arkiv.radio24syv.dk/audiopodcast/channel/3843152',
  harddisken:   'http://podcast.dr.dk/p1/rssfeed/harddisken.xml',
  harmontown:   'http://castmate.fm/feed.php?u=harmontownpodcast',
  montecarlo:   'http://podcast.dr.dk/p3/rssfeed/monte_carlo.xml',
  tuxradar:     'http://tuxradar.com/files/podcast/podcast_ogg.rss'
}

app.prepBatch(feeds, function(err, setup) {
  app.runBatch(setup, function(err) {
    app.getAll(function(err, res) {
      if (err)console.log(err);
      else console.log(res);
    });
  });
});
