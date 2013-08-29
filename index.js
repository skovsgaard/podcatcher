var podcatcher = require('./podcatcher');

var callback = function(err, meta) {
  if (err) console.log(err);
  if (meta) console.log(meta);
}

//podcatcher.getByDate('http://www.tuxradar.com/files/podcast/podcast_ogg.rss', '2013-08-01', callback);
//podcatcher.getNewest('http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback);
podcatcher.getMeta('http://www.tuxradar.com/files/podcast/podcast_ogg.rss', callback);