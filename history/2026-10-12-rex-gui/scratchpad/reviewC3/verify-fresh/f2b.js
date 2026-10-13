global.window = {}; require(process.argv[2] + '/src/data.js'); const D = window.DINO_DATA;
const P = require(process.argv[2] + '/src/engine.js');
const ch = D.energyRefs.find((e) => e.id === 'chicxulub'); console.log('rung', ch.J, ch.rough, ch.lo, ch.hi, Object.keys(ch));
