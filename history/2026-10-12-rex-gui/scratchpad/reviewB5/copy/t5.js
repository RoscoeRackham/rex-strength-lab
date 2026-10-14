const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'jump-sand-1e7-def', tab: 'jump', state: { logKg: 7, surface: 'sand' }, pick: 'allout' },
  { id: 'jump-sand-1e7-off', tab: 'jump', state: { logKg: 7, surface: 'sand', ...OFF }, pick: 'allout' },
  { id: 'jump-1e12-def', tab: 'jump', state: { logKg: 12 }, pick: 'allout' },
  { id: 'jump-1e12-off', tab: 'jump', state: { logKg: 12, ...OFF }, pick: 'allout' },
  { id: 'jump-1e20-def', tab: 'jump', state: { logKg: 20 }, pick: 'allout' },
  { id: 'jump-1e20-def-ground', tab: 'jump', state: { logKg: 20 }, pick: 'ground' },
]).then(()=>{});
