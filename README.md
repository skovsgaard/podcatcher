# Podcatcher

Node.js module using LevelDB to organize and download from podcast RSS feeds.

This module is a small collection of helper functions for easily writing apps for organizing and accesssing podcast feeds, combining getting, parsing and storing a list of feeds.

## Dependencies

- [request](https://github.com/mikeal/request)
- [ortoo-feedparser](https://github.com/ortoo/node-feedparser)
- [level](https://github.com/level/level)

Also if you want to run the tests, make sure you've got mocha installed: `sudo npm install -g mocha`


## How to use

In order to use podcatcher, either download it by cloning this repository and using `sudo npm install` to get the dependencies or just running `sudo npm install podcatcher`

From there, just require it like any other module with `var podcatcher = require('podcatcher');`

## What's included

The way it works now, podcatcher exposes the following functions:

### .getAll() or podcatcher()

Takes an RSS feed URL and a callback, returning the callback with the arguments `err`, `meta`, and `articles` where `meta` is the metadata (description, etc.) for the specified RSS feed, and `articles` is the full list of that feed's articles.

```js
podcatcher.getAll('http://feeds.feedburner.com/NodeUp', function(err, meta, articles) {
  if (err) console.log(err);
  console.log(meta);
  articles.forEach(function(item) {
    console.log(item);
  });
});
```

### .getNewest()

Takes an RSS feed URL and a callback, returning the callback with the arguments `err`, `meta`, and `article` where `meta` is the metadata for the most recent entry in the feed (title, time, etc.) and `article` is the content of the entry itself (shownotes, media, etc.).

```js
podcatcher.getNewest('http://feeds.feedburner.com/NodeUp', function(err, meta, article) {
  if (err) console.log(err);
  console.log(meta);
  console.log(article);
});
```

### .downloadNewest()

Works exactly like `.getNewest()` with the addition that instead of simply returning the elements of the feed entry, it also downloads the first media enclosed in the article either to the root of the application folder or - if you have one - to the subfolder, `media/`.

### .getByDate()

Like `.getNewest()` but targeting a specific date instead of the most recent feed entry, and as such it takes a `date` argument in addition to the `feedUrl`. This is by no means ready for any kind of serious use since it doesn't yet consider multiple entries per day and a whole bunch of other things.

```js
podcatcher.getByDate('http://feeds.feedburner.com/NodeUp', '2014-02-17', function(err, meta, article) {
  if (err) console.log(err);
  console.log(meta);
  console.log(article);
});
```

### .downloadByDate()

Like `.getByDate()` with the addition that it downloads the first media item enclosed in the article body.

### .putFeed()

Takes a title, an RSS feed URL, and a callback returning the callback with the arguments `err` and `res`, the latter being a string confirming that the feed was saved to LevelDB properly.

```js
podcatcher('NodeUp', 'http://feeds.feedburner.com/NodeUp', function(err, res) {
  if (err) console.log(err);
  console.log(res);
});
```

### .getDB()

Takes a callback with the arguments, `err`, `res`, where res is an array of everything in LevelDB (which should be a list of RSS feeds).

```js
podcatcher.getDB(function(err, res) {
  if (err) console.log(err);
  console.log(res);
});
```

### .getFeed()

Takes a feed title and a callback with the arguments `err` and `res` where `res` is the url of the feed.

```js
podcatcher.getFeed('nodeup', function(err, res) {
  if (err) console.log(err);
  console.log(res);
});
```

