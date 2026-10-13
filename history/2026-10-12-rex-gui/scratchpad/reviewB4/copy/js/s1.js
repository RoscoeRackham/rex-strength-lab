const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const AS = Math.log10(1.8e23 / 1); // dial kg
module.exports = [
  { name: 'allstar100', tab: 'throw', st: { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, effort: 'allout' },
  { name: 'allstar50', tab: 'throw', st: { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0.5 }, effort: 'allout' },
  { name: 'allstar0', tab: 'throw', st: { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0 }, effort: 'allout' },
  { name: 'allstar0off', tab: 'throw', st: Object.assign({ obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0 }, OFF), effort: 'allout' },
  { name: 'allstar0kf', tab: 'throw', st: { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0, keepForm: true }, effort: 'allout' },
  { name: 'allstar50nokf', tab: 'throw', st: { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0.5, keepForm: false }, effort: 'allout' },
  { name: 'base_allout100', tab: 'throw', st: { obj: 'baseball' }, effort: 'allout' },
  { name: 'base_allout50', tab: 'throw', st: { obj: 'baseball', airAbsorb: 0.5 }, effort: 'allout' },
  { name: 'base_allout0', tab: 'throw', st: { obj: 'baseball', airAbsorb: 0 }, effort: 'allout' },
  { name: 'car_allout100', tab: 'throw', st: { obj: 'car' }, effort: 'allout' },
  { name: 'car_allout30', tab: 'throw', st: { obj: 'car', airAbsorb: 0.3 }, effort: 'allout' },
  { name: 'car_allout_off', tab: 'throw', st: Object.assign({ obj: 'car' }, OFF), effort: 'allout' },
  { name: 'car_1e9_100', tab: 'throw', st: { obj: 'car', logKg: 9 }, effort: 'allout' },
  { name: 'car_1e9_50', tab: 'throw', st: { obj: 'car', logKg: 9, airAbsorb: 0.5 }, effort: 'allout' },
  { name: 'car_1e12_100', tab: 'throw', st: { obj: 'car', logKg: 12 }, effort: 'allout' },
  { name: 'car_1e12_50', tab: 'throw', st: { obj: 'car', logKg: 12, airAbsorb: 0.5 }, effort: 'allout' },
  { name: 'car_1e15_50', tab: 'throw', st: { obj: 'car', logKg: 15, airAbsorb: 0.5 }, effort: 'allout' },
  { name: 'car_1e15_90', tab: 'throw', st: { obj: 'car', logKg: 15, airAbsorb: 0.9 }, effort: 'allout' },
];
