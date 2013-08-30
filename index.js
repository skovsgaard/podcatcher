var podcatcher = require('./podcatcher');

var callback = function(err, meta, articles) {
  if (err) console.log(err);
  if (meta) console.log(meta.description);
}

//podcatcher.getByDate(
//  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', '2013-08-01', callback
//);

//podcatcher.getNewest(
//  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback
//);

//podcatcher.getMeta(
//  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback
//);

//podcatcher.getAll(
//  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback
//);

//podcatcher.downloadNewest(
//  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback
//);

podcatcher.downloadByDate(
  'http://www.tuxradar.com/files/podcast/podcast_ogg.rss', '2013-08-01', callback
);