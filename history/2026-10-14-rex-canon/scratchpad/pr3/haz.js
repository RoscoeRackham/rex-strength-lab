global.window = {};
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(ROOT + '/test/powers-off-cases.js');
P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017;
const list = cases(P, D).filter((c) => /^plan\|throw\|person\|inf\|.*\|5$/.test(c.key));
for (const c of list) { const res = c.run({}); console.log(c.key, JSON.stringify(res.hazards.find((h) => h.id === 'passenger')), res.reachAll.passenger, JSON.stringify(res.ceiling).slice(0, 200)); }
