var feedparser = require('ortoo-feedparser');
var request = require('request');
var fs      = require('fs');

// Utility function to download media at specified URL
function downloadMedia(mediaUrl, title) {
  var media = request(mediaUrl).pipe(fs.createWriteStream(title));

  console.log('Downloading ' + title);

  var waitTick = setInterval(function() {
    console.log("...");
  }, 20000);

  media.on('finish', function() {
    clearInterval(waitTick);
    console.log(title + ' is done!');
  });
}

function getLatest(meta, articles) {
    var latest = articles[0];
    var latestMedia = latest.enclosures[0].url;
    var latestDate = latest.pubDate.toISOString().slice(0,10);
    var extension = latest.enclosures[0].type;
    extension = '.' + extension.slice(extension.indexOf('/'), extension.length);
    var episodeTitle = meta.title + '-' + latestDate + extension;
    episodeTitle = episodeTitle.replace(/\s+/g, '').toLowerCase();

    downloadMedia(latestMedia, episodeTitle);
}

function getByDate(date, meta, articles) {
    var article;
    var media;
    var title;
    for (var i=0; i< articles.length; i++) {
      if (articles[i].pubDate.toISOString().slice(0,10) == date) {
        article = articles[i];
      }
    }
    media = article.enclosures[0].url;
    var extension = article.enclosures[0].type;
    extension = '.' + extension.slice(extension.indexOf('/')+1, extension.length);
    title = meta.title + '-' + date + extension;
    title = title.replace(/\s+/g, '').toLowerCase();

    downloadMedia(media, title);
}

// Get the latest media in the specified podcast stream and download it.
podcatcher.getNewest = function(feedUrl, cb) {
  var err;

  // Callback to locate the newest media and download it
  function getArticle(err, meta, articles) {
    getLatest(meta, articles);

    if (meta) {
      cb(null, meta);
    } else {
      cb(new Error('Error 500'));
    }
  }

  var newestMedia = feedparser.parseUrl(feedUrl, getArticle);
};

// Get the specified article in the specified podcast stream and download it.
podcatcher.getByDate = function(feedUrl, date, cb) {

  // Callback to locate the media at date and download it
  function getArticle(err, meta, articles) {
    getByDate(date, meta, articles);

    if (meta) {
      cb(null, meta);
    } else if (err) {
      cb(new Error('Error 500'));
    }
  }

  // Parse feed and download in parser's callback
  var media = feedparser.parseUrl(feedUrl, getArticle);

};

// Default function for module, returning metadata of specified feed.
function podcatcher(feedUrl, cb) {
  feedparser.parseUrl(feedUrl, function(err, meta, articles) {
    if (err) {
      cb(err, meta);
    } else {
      cb(null, meta);
    }
  });
}

module.exports = podcatcher;