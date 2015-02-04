# all-the-free-drum-kits

scrapes [freedrumkits](http://www.freedrumkits.net/). i mostly wanted to play with [trumpet](https://github.com/substack/node-trumpet)

i haven't actually ran this to completion, because there are like 1327 kits on there

FATAL FLAW: this script runs forever, because it doesn't recognize empty pages, so it keeps on requesting the next page, even when it has gone out of bounds
