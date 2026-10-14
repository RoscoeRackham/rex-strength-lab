const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'stomp-1e10-def', tab: 'stomp', state: { logKg: 10 }, pick: 'allout' },
  { id: 'stomp-1e10-sand-def', tab: 'stomp', state: { logKg: 10, surface: 'sand' }, pick: 'allout' },
  { id: 'stomp-1e10-ownoff', tab: 'stomp', state: { logKg: 10, ownRecoil: false }, pick: 'allout' },
  { id: 'punch-1e10-def', tab: 'punch', state: { logKg: 10 }, pick: 'allout' },
  { id: 'stomp-1e10-ground', tab: 'stomp', state: { logKg: 10 }, pick: 'ground' },
]).then(()=>{});
