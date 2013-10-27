var podcatcher = require('./podcatcher');
var url = 'http://www.tuxradar.com/files/podcast/podcast_ogg.rss';
var feedTitle = 'TuxRadar';
var callback = function(err, meta, articles) {
  if (err) console.log(err);
  if (meta) console.log(meta.description);
  if (articles) console.log(articles[articles.length-1]);
}

//podcatcher(url, callback);

//podcatcher.getByDate(url, '2013-08-01', callback);

//podcatcher.getNewest(url , callback);

//podcatcher.getMeta(url , callback);

//podcatcher.getAll(url , callback);

//podcatcher.downloadNewest(url , callback);

//podcatcher.downloadByDate(url, '2013-08-01', callback);

//podcatcher.saveFeed(url, feedTitle, callback);

podcatcher.readFeed(feedTitle, callback);
