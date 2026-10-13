const run = require('./h.js');
const AS = { logKg: Math.log10(1.8e23), obj: 'baseball', angle: 0 };
run([
  { id: 'as-50-keepoff', tab: 'throw', state: { ...AS, airAbsorb: 0.5, keepForm: false }, pick: 'allout' },
  { id: 'as-100-keepoff', tab: 'throw', state: { ...AS, keepForm: false }, pick: 'allout' },
  { id: 'as-100-down', tab: 'throw', state: { ...AS, angle: 0, logKg: 20 }, pick: 'allout' },
  { id: 'pyr-up-50', tab: 'throw', state: { logKg: 18.5, obj: 'pyramid', angle: 90, airAbsorb: 0.5 }, pick: 'allout' },
]).then(()=>{});
