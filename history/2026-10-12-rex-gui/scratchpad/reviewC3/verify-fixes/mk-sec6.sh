#!/bin/sh
# usage: mk-sec6.sh <project copy dir>  -> writes <dir>/test/sec6.js : shots.js lines 1-35 + section 6 (531-616)
D=$1
{ sed -n 1,35p $D/test/shots.js; sed -n 531,616p $D/test/shots.js; } > $D/test/sec6.js
