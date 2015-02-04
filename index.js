var fs = require('fs');
var request = require('request');
var trumpet = require('trumpet');

var baseUrl = 'http://www.freedrumkits.net';
var kitsPerPage = 10;

function createDrumKitFinder () {
  var tr = trumpet();

  tr.selectAll('.rd_file .folder_url', function (anchor) {
    tr.emit('drumKit', anchor.getAttribute('href'));
  });

  return tr;
}

function downloadDrumKit (href) {
    var drumKitName = href.split('/').pop();
    console.log('Downloading ' + drumKitName);

    var out = fs.createWriteStream(drumKitName + '.zip');
    request(baseUrl + href + '/download')
      .pipe(out);
}

// Each URL is like `?start=10` to skip the first 10 kits.
function getDrumKits (start) {
  var pageRequest = request(baseUrl + '/drum-kits?start=' + start)

  var pageHasDrumKit = false;
  pageRequest
    .pipe(createDrumKitFinder())
    .on('drumKit', function (href) {
      pageHasDrumKit = true;
      downloadDrumKit(href);
    });

  pageRequest.on('end', function () {
    if (pageHasDrumKit) {
      // Get the next page!
      getDrumKits(start + kitsPerPage);
    }
  });
}

// lezdoit
getDrumKits(0);
