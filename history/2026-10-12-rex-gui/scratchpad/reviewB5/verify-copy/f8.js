const run = require('./harness.js');
const off = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'colOff', tab: 'collide', state: Object.assign({ anchor: 'bolted' }, off), pick: 'plaster' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /quake|Quake|models the ground|crater|TNT into the ground/i.test(l)).join('\n')); } });
