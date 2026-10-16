const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
// both bolted, power off (pre-existing physics)
const r = P.standoff(c3(dial, O3, on({ unbreakable: false, ownRecoil: false, anchor: 'bolted' })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false, ownRecoil: false })));
console.log('both bolted, power off', { DA: sig(r.DA), outcome: r.outcome, contact: sig(r.contact), rock: r.rock && { tear: sig(r.rock.tear), dipole: r.rock.dipole } });
