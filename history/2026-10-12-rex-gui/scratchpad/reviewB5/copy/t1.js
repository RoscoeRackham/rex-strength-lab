const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'throw-def-least', tab: 'throw', state: {} },
  { id: 'throw-def-allout', tab: 'throw', state: {}, pick: 'allout' },
  { id: 'throw-off-allout', tab: 'throw', state: OFF, pick: 'allout' },
  { id: 'throw-50-allout', tab: 'throw', state: { airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'throw-0on-allout', tab: 'throw', state: { airAbsorb: 0 }, pick: 'allout' },
]);
