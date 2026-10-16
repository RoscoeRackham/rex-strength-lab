const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
const D = (x) => Object.assign({ duoOpen: true }, x);
const S = [];
const add = (name, st, effort, click) => S.push({ name, st, effort, click });
const L9 = 9, L12 = 12;
// solo
for (const [nm, st] of [['throw car', { action: 'throw', obj: 'car' }], ['throw person', { action: 'throw', obj: 'person' }], ['throw baseball', { action: 'throw', obj: 'baseball' }]]) {
  add(nm + ' least', st); add(nm + ' allout', st, 'allout'); add(nm + ' 1e9 allout', Object.assign({ logKg: L9 }, st), 'allout');
  add(nm + ' inf allout', Object.assign({ inf: true }, st), 'allout'); add(nm + ' bolted allout', Object.assign({ anchor: 'bolted' }, st), 'allout'); add(nm + ' off allout', Object.assign({}, st, OFF), 'allout');
  add(nm + ' half-air allout', Object.assign({ airAbsorb: 0.5 }, st), 'allout');
}
add('throw car 1e12 allout', { action: 'throw', obj: 'car', logKg: L12 }, 'allout');
for (const [nm, st] of [['jump soft', { action: 'jump', softLanding: true }], ['stomp', { action: 'stomp' }], ['punch silent', { action: 'punch', silentStrike: true }], ['clap silent', { action: 'clap', silentStrike: true }]]) {
  add(nm + ' least', st); add(nm + ' allout', st, 'allout'); add(nm + ' 1e9 allout', Object.assign({ logKg: L9 }, st), 'allout');
  add(nm + ' inf allout', Object.assign({ inf: true }, st), 'allout'); add(nm + ' bolted allout', Object.assign({ anchor: 'bolted' }, st), 'allout'); add(nm + ' off allout', Object.assign({}, st, OFF), 'allout');
}
for (const w of ['krakatoa', 'chicxulub', 'sun']) add('weight ' + w, { action: 'weight' }, null, '#grow-what-' + w);
// duo
for (const [nm, st] of [['wthrow', D({ duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45 })], ['catch car', D({ duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: 1 })], ['catch car hard', D({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 1 })], ['catch baseball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1 })], ['catch person', D({ duoAction: 'catch', cObj: 'person', cStyle: 'easy', cLogD: 1 })], ['catch person hard', D({ duoAction: 'catch', cObj: 'person', cStyle: 'hard', cLogD: 1 })], ['toss', D({ duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 1 })], ['toss hard', D({ duoAction: 'catch', cObj: 'partner', cStyle: 'hard', cLogD: 1 })], ['collide', D({ duoAction: 'collide' })]]) {
  add(nm + ' least', st); add(nm + ' allout', st, 'allout'); add(nm + ' 1e9 allout', Object.assign({ logKg: L9 }, st), 'allout');
  add(nm + ' inf allout', Object.assign({ inf: true }, st), 'allout'); add(nm + ' bolted allout', Object.assign({ anchor: 'bolted', oAnchor: 'bolted' }, st), 'allout'); add(nm + ' off allout', Object.assign({}, st, OFF), 'allout');
}
add('catch car miss allout', D({ duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: 1, cMiss: true }), 'allout');
add('catch person miss allout', D({ duoAction: 'catch', cObj: 'person', cStyle: 'easy', cLogD: 1, cMiss: true }), 'allout');
add('fireball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0.5 }), 'allout');
const gb = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
add('collide 0.1c', D({ duoAction: 'collide', colSrc: 'set', colGB: gb }), 'allout');
add('collide 0.1c windows', D({ duoAction: 'collide', colSrc: 'set', colGB: gb }), 'windows');
add('collide 0.1c bounce', D({ duoAction: 'collide', colSrc: 'set', colGB: gb, colBounce: 'bounce' }), 'allout');
add('collide lightspeed', D({ duoAction: 'collide', colSrc: 'set', colInf: true }), 'allout');
add('collide rex charges', D({ duoAction: 'collide', colWho: 'rex' }), 'allout');
add('collide rex charges 0.1c', D({ duoAction: 'collide', colWho: 'rex', colSrc: 'set', colGB: gb }), 'allout');
add('collide jump', D({ duoAction: 'collide', colSrc: 'jump' }), 'allout');
fs.writeFileSync('scen.json', JSON.stringify(S));
console.log(S.length);
