#!/bin/bash
D=$(dirname "$0")
run() { cp "$D/engine.orig.js" "$D/mut/src/engine.js"; perl -0pi -e "$2" "$D/mut/src/engine.js"; if cmp -s "$D/engine.orig.js" "$D/mut/src/engine.js"; then echo "$1: MUTATION DID NOT APPLY"; return; fi; echo -n "$1: "; (cd "$D/mut" && timeout 300 node test/presence.js 2>&1 | grep -E "^FAIL|checks" | tr '\n' ' '); echo; }
run baseline 's/PLASTER_F: 40/PLASTER_F: 40 /'
run plasterHigh 's/plasterHigh: 2\.0 \* 0\.0254/plasterHigh: 0.5 * 0.0254/'
run PLASTER_F 's/PLASTER_F: 40,/PLASTER_F: 1e9,/'
run firmsand 's/firmsand: \{ rho: 1800, cs: 280/firmsand: { rho: 1800, cs: 450/'
run elephant 's/lo: 0\.15, hi: 8,/lo: 0.5, hi: 2,/'
run DP_WINDOWS 's/DP_WINDOWS: 6900,/DP_WINDOWS: 3400,/'
run DP_WIN 's/DP_WIN: \[3400, 6900\]/DP_WIN: [6900, 6900]/'
run DP_HOUSES 's/DP_HOUSES: 26800,/DP_HOUSES: 13800,/'
run TISSUE_C 's/TISSUE_C: 1540,/TISSUE_C: 1000,/'
run SAFE_DP 's/SAFE_DP: 100,/SAFE_DP: 200,/'
run SAFE_U 's/SAFE_U: 0\.25,/SAFE_U: 0.5,/'
cp "$D/engine.orig.js" "$D/mut/src/engine.js"
