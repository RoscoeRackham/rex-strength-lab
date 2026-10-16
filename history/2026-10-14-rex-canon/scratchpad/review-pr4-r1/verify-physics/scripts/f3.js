const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
for (const own of [true, false]) {
  const r = P.standoff(c3(dial, O3, on({ unbreakable: false, ownRecoil: own })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false, ownRecoil: own })));
  console.log('own', own, { DA: sig(r.DA), HB: r.HB, outcome: r.outcome, contact: sig(r.contact), rockTear: r.rock && sig(r.rock.tear), tearCap: r.rock && sig(r.rock.tearCap) });
}
// charge on same tab, same settings
const c = P.collide(c3(dial, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })), { source: 'sprint' });
console.log('charge', c.outcome, c.carry && { rockGives: c.carry.rockGives, tear: sig(c.carry.tear) });
// at what effort does the steady push exceed the tear?
const tear = 696773; console.log('tear in kg-force', sig(tear / g));
