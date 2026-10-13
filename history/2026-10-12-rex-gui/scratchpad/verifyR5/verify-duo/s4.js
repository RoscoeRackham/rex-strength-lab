global.window = {};
const P = require(process.argv[2] + '/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
for (const [kg, th] of [[100*907.18474,45],[300*907.18474,10],[300*907.18474,45],[1e9,75],[1e9,30]]) {
  const cA = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: sf, anchor: 'friction' }, { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
  const t = P.throwPartner(cA, Object.assign({}, cA, { body: ollie }), th);
  const lt = t.landToGround;
  console.log(`${(kg/907.18474).toExponential(2)}st th=${th}:`, lt ? `J=${lt.J.toFixed(0)} whole=${lt.whole.toFixed(0)} supDown=${lt.suppliedDown.toFixed(0)} supSide=${lt.suppliedSide.toFixed(0)}` : 'no landToGround (whole landing, as real ground)');
}
