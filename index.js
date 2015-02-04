var fs = require('fs');
var request = require('request');
var trumpet = require('trumpet');

var baseUrl = 'http://www.freedrumkits.net';
var kitsPerPage = 10;

function last (list) {
  if (list.length) {
    return list[list.length - 1];
  }
}

function createDrumKitDownloader () {
  var tr = trumpet();

  tr.selectAll('.rd_file .folder_url', function (anchor) {
    var href = anchor.getAttribute('href');
    var drumKitName = last(href.split('/'));

    console.log('Downloading ' + drumKitName);

    var out = fs.createWriteStream(drumKitName + '.zip');
    request(baseUrl + href + '/download')
      .pipe(out);
  });

  return tr;
}

// Each URL is like `?start=10` to skip the first 10 kits.
function getDrumKits (start) {
  var pageRequest = request(baseUrl + '/drum-kits?start=' + start)

  pageRequest.on('end', function () {
    // Get the next page!
    getDrumKits(start + 10);
  });

  pageRequest.pipe(createDrumKitDownloader());
}

// lezdoit
getDrumKits(0);
