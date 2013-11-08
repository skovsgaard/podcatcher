var feedparser  = require('ortoo-feedparser');
var request     = require('request');
var fs          = require('fs');
var level       = require('level');
var db          = level('db')
var mediaDir    = '';

fs.exists('media/', function(exists) {
  if (exists) {
    mediaDir = 'media/';
  }
});

/*
 * Helper functions for use in identifying and downloading feeds/articles
 */

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

/*
 * Module methods
 */

// Default function for module, returning metadata of specified feed.
function podcatcher(feedUrl, cb) {
  feedparser.parseUrl(feedUrl, function(err, meta, articles) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, meta, articles);
    }
  });
}

// Same functionality as podcatcher(), added for consistency with other methods.
podcatcher.getAll = podcatcher;

// Get the latest media in the specified podcast stream and download it.
podcatcher.getNewest = function(feedUrl, cb) {

  // Callback to locate the newest media and download it.
  function getArticle(err, meta, articles) {
    var article = articles[0];

    if (meta) {
      return cb(null, meta, article);
    } else if (err) {
      return cb(err);
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
      return cb(err);
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
      return cb(err);
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
      return cb(err);
    } else {
      return cb(null, meta, article);
    }
  }

  // Find the feed and issue the callback.
  this.getByDate(feedUrl, date, download);
}

/*
 * Methods for dealing with LevelDB
 */

function getFeed(feed, cb) {
  db.get(feed, function(err, res) {
    if (err) return cb(err);
    return cb(null, res);
  })
}

function putFeed(feed, url, cb) {
  db.put(feed, url, function(err) {
    if (err) return cb(err);
    return cb(null, 'Feed saved successfully as ' + '\"' + feed + '\"');
  });
}

//Prepare an object representing the data to write, in an array for use with a Level batch operation

//function prepBatch(feedObj, cb) {
//  var setup = [];
//  for (x in feedObj) {
//    setup.push({type:'put',key:x,value:feedObj[x]});
//  }
//  if (setup.length == 0) return cb(new Error('Error creating batch staging array.'));
//  cb(null, setup);
//}
//
//// When module is prepared, run the batch operation.
//
//function runBatch(setupArr, cb) {
//  if (!setupArr) return (cb(new Error('No array of feeds prepared.')));
//  db.batch(setupArr, function(err) {
//    if (err) return cb(err);
//    return cb(null, 'Feed array successfully saved.');
//  });
//}

// Return everything in db.
//
function getDBContents(cb) {
  var res = [];
  db.createReadStream().on('data', function(data) {
    res.push(data);
  }).on('error', function(err) {
    return cb(err);
  }).on('end', function() {
    return cb(null, res);
  })
}

podcatcher.putFeed = putFeed;
//podcatcher.prepBatch = prepBatch;
//podcatcher.runBatch = runBatch;
podcatcher.getDB = getDBContents;
podcatcher.getFeed = getFeed;
module.exports = podcatcher;

