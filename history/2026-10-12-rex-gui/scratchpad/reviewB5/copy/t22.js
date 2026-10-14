const run = require('./h.js');
run([
  { id: 'catch-rel-100-d10', tab: 'catch', state: { logKg: 20, cObj: 'baseball', cStyle: 'hard', cLogD: 1 }, pick: 'allout' },
  { id: 'catch-rel-50-d10', tab: 'catch', state: { logKg: 20, cObj: 'baseball', cStyle: 'hard', cLogD: 1, airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'catch-rel-100-d1e5', tab: 'catch', state: { logKg: 20, cObj: 'baseball', cStyle: 'hard', cLogD: 5 }, pick: 'allout' },
  { id: 'catch-partner-rel-50', tab: 'catch', state: { logKg: 20, cObj: 'partner', cStyle: 'hard', airAbsorb: 0.5 }, pick: 'allout' },
  { id: 'catch-partner-rel-100', tab: 'catch', state: { logKg: 20, cObj: 'partner', cStyle: 'hard' }, pick: 'allout' },
]).then(()=>{});
