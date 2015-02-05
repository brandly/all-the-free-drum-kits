'use strict';
var meow = require('meow');
var getDrumKits = require('./');

var cli = meow({
  help: [
    'Usage',
    '  node cli',
    '',
    'Example',
    '  node cli --path ~/Documents/drum-kits --start 30',
    '',
    'Options',
    '  --path    Where the drum kits end up. Defaults to current directory.',
    '  --start   Skip past some kits and start on a certain index. Defaults to 0.'
  ].join('\n')
});

getDrumKits({
  dest: cli.flags.path,
  start: cli.flags.start
});
