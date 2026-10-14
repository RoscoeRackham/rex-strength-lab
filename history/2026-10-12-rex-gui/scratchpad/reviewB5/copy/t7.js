const run = require('./h.js');
run([
  { id: 'pull-nimitz-heavy-ownoff', tab: 'pull', state: { logKg: 14, obj: 'loco', surface: 'granite', m: 3e9, ownRecoil: false }, pick: 'allout' },
  { id: 'pull-nimitz-heavy-ownon', tab: 'pull', state: { logKg: 14, obj: 'loco', surface: 'granite', m: 3e9 }, pick: 'allout' },
  { id: 'pull-nimitz-ownon', tab: 'pull', state: { logKg: 14, obj: 'loco', surface: 'granite' }, pick: 'allout' },
]).then(()=>{});
