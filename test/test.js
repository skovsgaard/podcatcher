var assert = require('assert');
var podcatcher = require('./../podcatcher');
var feedUrl = 'http://feeds.feedburner.com/NodeUp';
var feedName = 'nodeup';
var date = '2013-11-07';

describe('Podcatcher', function() {
  
  describe('#getAll()', function() {
    it('should return a full feed', function(done) {
      podcatcher.getAll(feedUrl, function(err, meta, articles) {
        if (err) throw err;
        done();
      });
    });
  });
  
  describe('#getNewest()', function() {
    it('should return the latest item in specified feed', function(done) {
      podcatcher.getNewest(feedUrl, function(err, meta, article) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('#downloadNewest()', function() {
    it('should save the attachment of the latest item to the media dir', function(done) {
      podcatcher.downloadNewest(feedUrl, function(err, meta, article) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('#getByDate()', function() {
    it('should return the article matching the specified date', function(done) {
      podcatcher.getByDate(feedUrl, date, function(err, meta, article) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('#downloadByDate()', function() {
    it('should download the attachment of the specified article to the media dir', function(done) {
      podcatcher.downloadByDate(feedUrl, date, function(err, meta, article) {
        if (err) throw err;
        done();
      });
    });
  });

  // Methods related to db calls
  
  describe('#getFeed()', function() {
    it('should return the requested feed', function(done) {
      podcatcher.putFeed(feedName, feedUrl, function(err, res) {
	console.log('Put stuff in DB');
      });

      podcatcher.getFeed(feedName, function(err, res) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('#putFeed()', function() {
    it('should successfully put the key-value pair in the db', function(done) {
      podcatcher.putFeed(feedName, feedUrl, function(err, res) {
        if (err) throw err;
        assert.equal('Feed saved', res.slice(0,10));
        done();
      });
    });
  });

  describe('#getDB', function() {
    it('should return everything in database', function(done) {
      podcatcher.getDB(function(err, res) {
        if (err) throw err;
        done();
      })
    });
  });
});
