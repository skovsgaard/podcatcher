var feedparser = require('ortoo-feedparser');
var request = require('request');
var level = require('level');
var fs      = require('fs');
var db = level('db', {valueEncoding: 'json'});
var mediaDir = '';

fs.exists('media/', function(exists) {
  if (exists) {
    mediaDir = 'media/';
  }
});

// Download media at specified URL and set a ticker to indicate activity.
function downloadMedia(mediaUrl, title) {
  var media = request(mediaUrl).pipe(fs.createWriteStream(mediaDir+title));

  console.log('Downloading ' + title);

  // Set 15sec ticker to indicate download activity.
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
    // Check if the date of article[i] is a match.
    if (articles[i].pubDate.toISOString().slice(0,10) == date) {
      article = articles[i];
    }
  }
  return article;
}

// Determine media type and set filename accordingly.
function getMediaType(article, meta) {
  var extension = article.enclosures[0].type;
  var date = article.pubDate.toISOString().slice(0,10);
  // Set extension to the filetype in .type, and ensure filename is lower case.
  extension = '.' + extension.slice(extension.indexOf('/')+1, extension.length);
  var title = meta.title + '-' + date + extension;
  title = title.replace(/\s+/g, '').toLowerCase();

  return title;
}

// Default function for module, returning metadata of specified feed.
function podcatcher(feedUrl, cb) {
  feedparser.parseUrl(feedUrl, function(err, meta, articles) {
    if (err) {
      return cb(err, meta);
    } else {
      return cb(null, meta);
    }
  });
}

// Same functionality as podcatcher(), added for consistency with other methods.
podcatcher.getAll = podcatcher;

// Test method for object writing
podcatcher.saveFeed = function(feedUrl, feedTitle, cb) {
  podcatcher(feedUrl, function(err, meta, articles) {
    db.put(feedTitle, meta, function(err) {
      if (err) return cb(err);
      return cb(null, meta);
    });
  });
}

// Test method for reading from levelDB
podcatcher.readFeed = function(key, cb) {
  db.get(key, function(err, val) {
    if (err) return cb(err);
    return cb(null, val);
  })
}

// Get the latest media in the specified podcast stream and download it.
podcatcher.getNewest = function(feedUrl, cb) {

  // Callback to locate the newest media and download it.
  function getArticle(err, meta, articles) {
    var article = articles[0];

    if (meta) {
      return cb(null, meta, article);
    } else if (err) {
      return cb(new Error('Error 500'));
    }
  }

  feedparser.parseUrl(feedUrl, getArticle);
};

podcatcher.downloadNewest = function(feedUrl, cb) {

  // Callback to download media.
  function download(err, meta, article) {
    var fileName = getMediaType(article, meta);
    downloadMedia(article.enclosures[0].url, fileName);

    if (err) {
      return cb(new Error('Error 500'));
    } else {
      return cb(null, meta, article);
    }
  }

  // Get the feed and issue callback.
  this.getNewest(feedUrl, download);
};

// Get the specified article in the specified podcast stream and download it.
podcatcher.getByDate = function(feedUrl, date, cb) {

  // Callback to locate the media at date and download it.
  function getArticle(err, meta, articles) {
    var article = getByDate(date, articles);

    if (meta) {
      return cb(null, meta, article);
    } else if (err) {
      return cb(new Error('Error 500'));
    }
  }

  // Parse feed and download in parser's callback.
  feedparser.parseUrl(feedUrl, getArticle);
};

podcatcher.downloadByDate = function(feedUrl, date, cb) {

  // Callback to download media.
  function download(err, meta, article) {
    var fileName = getMediaType(article, meta);
    downloadMedia(article.enclosures[0].url, fileName);

    if (err) {
      return cb(new Error('Error 500'));
    } else {
      return cb(null, meta, article);
    }
  }

  // Find the feed and issue the callback.
  this.getByDate(feedUrl, date, download);
}

module.exports = podcatcher;
