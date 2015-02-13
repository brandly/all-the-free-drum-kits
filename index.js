'use strict';
var fs = require('fs');
var path = require('path');
var request = require('request');
var trumpet = require('trumpet');

var baseUrl = 'http://www.freedrumkits.net';
var kitsPerPage = 10;

function createDrumKitFinder() {
  var tr = trumpet();

  tr.selectAll('.rd_file .folder_url', function (anchor) {
    tr.emit('drumKit', anchor.getAttribute('href'));
  });

  return tr;
}

function downloadDrumKit(href, dest) {
    var drumKitName = href.split('/').pop();
    console.log('Downloading ' + drumKitName);

    var out = fs.createWriteStream(path.resolve(dest, drumKitName + '.zip'));
    request(baseUrl + href + '/download')
      .pipe(out);
}

module.exports = function getDrumKits(opts) {
  opts || (opts = {});
  opts.start || (opts.start = 0);
  opts.dest || (opts.dest = __dirname);

  var pageRequest = request(baseUrl + '/drum-kits?start=' + opts.start);

  var pageHasDrumKit = false;
  pageRequest
    .pipe(createDrumKitFinder())
    .on('drumKit', function (href) {
      pageHasDrumKit = true;
      downloadDrumKit(href, opts.dest);
    });

  pageRequest.on('end', function () {
    if (pageHasDrumKit) {
      // Get the next page!
      getDrumKits({
        start: opts.start + kitsPerPage,
        dest: opts.dest
      });
    }
  });
};
