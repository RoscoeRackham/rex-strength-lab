const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const AS = { logKg: Math.log10(1.8e23), obj: 'baseball', angle: 0 };
run([
  { id: 'as-100', tab: 'throw', state: { ...AS }, pick: 'allout' },
  { id: 'as-50', tab: 'throw', state: { ...AS, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'as-0-keepoff', tab: 'throw', state: { ...AS, airAbsorb: 0, keepForm: false }, pick: 'allout' },
  { id: 'as-off', tab: 'throw', state: { ...AS, ...OFF }, pick: 'allout' },
  { id: 'as-0-keepon', tab: 'throw', state: { ...AS, airAbsorb: 0 }, pick: 'allout' },
]);
