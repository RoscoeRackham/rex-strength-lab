process.chdir(process.argv[2]);
const assert = require('assert');
const out = JSON.parse(JSON.stringify(require(process.argv[2] + '/tools/compute_limits.js').run()));
const cur = require(process.argv[2] + '/data/limits.json');
try { assert.deepStrictEqual(out, cur); console.log('limits.json MATCHES run()'); } catch (e) { console.log('limits.json DIFFERS'); for (const k of Object.keys(out)) if (JSON.stringify(out[k]) !== JSON.stringify(cur[k])) console.log(' key differs:', k); }
