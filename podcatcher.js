var feedparser = require('ortoo-feedparser');
var request = require('request');
var fs      = require('fs');

// Download media at specified URL and set a ticker to indicate activity.
function downloadMedia(mediaUrl, title) {
  var media = request(mediaUrl).pipe(fs.createWriteStream(title));

  console.log('Downloading ' + title);

  var waitTick = setInterval(function() {
    console.log("...");
  }, 15000);

  media.on('finish', function() {
    clearInterval(waitTick);
    console.log(title + ' is done!');
  });
}

// Get and return article from array, by date.
function getByDate(date, articles) {
  var article;
  for (var i=0; i< articles.length; i++) {
    if (articles[i].pubDate.toISOString().slice(0,10) == date) {
      article = articles[i];
    }
  }
  return article;
}

// Determine media
function getMediaType(article, meta) {
  var extension = article.enclosures[0].type;
  var date = article.pubDate.toISOString().slice(0,10);
  extension = '.' + extension.slice(extension.indexOf('/')+1, extension.length);
  title = meta.title + '-' + date + extension;
  title = title.replace(/\s+/g, '').toLowerCase();

  return title;
}

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

// Get the latest media in the specified podcast stream and download it.
podcatcher.getNewest = function(feedUrl, cb) {

  // Callback to locate the newest media and download it.
  function getArticle(err, meta, articles) {
    var article = articles[0];
    var fileName = getMediaType(article, meta);
    downloadMedia(article.enclosures[0].url, fileName);

    if (meta) {
      cb(null, meta);
    } else {
      cb(new Error('Error 500'));
    }
  }

  feedparser.parseUrl(feedUrl, getArticle);
};

// Get the specified article in the specified podcast stream and download it.
podcatcher.getByDate = function(feedUrl, date, cb) {

  // Callback to locate the media at date and download it
  function getArticle(err, meta, articles) {
    var article = getByDate(date, articles);
    var fileName = getMediaType(article, meta);
    downloadMedia(article.enclosures[0].url, fileName);

    if (meta) {
      cb(null, meta);
    } else if (err) {
      cb(new Error('Error 500'));
    }
  }

  // Parse feed and download in parser's callback
  feedparser.parseUrl(feedUrl, getArticle);
};

podcatcher.getMeta = function(feedUrl, cb) {

  function getMeta(err, meta, articles) {
    if (err) {
      return cb(err, meta);
    } else {
      return cb(null, meta);
    }
  }

  feedparser.parseUrl(feedUrl, getMeta);
}

module.exports = podcatcher;