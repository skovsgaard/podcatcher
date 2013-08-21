var feedparser = require('ortoo-feedparser');
var request = require('request');
var fs      = require('fs');

//function writeToFile(input, filename) {
//  var writer = fs.createWriteStream(filename);
//  writer.write(input);
//}

function podcatcher(input, output) {
  var getMedia = function(err, meta, articles) {
    var feedMedia = articles[0].enclosures[0].url;
    console.log('Downloading...');
    request(feedMedia).pipe(fs.createWriteStream('out.mp3').on('finish', function() {
      console.log('Done!');
    }));
  };

  feedparser.parseUrl(input, getMedia);
}

module.exports = podcatcher;