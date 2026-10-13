const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
run([
  { id: 'sprint-sand-def', tab: 'sprint', state: { surface: 'sand', logKg: 7 }, pick: 'allout' },
  { id: 'sprint-sand-off', tab: 'sprint', state: { surface: 'sand', logKg: 7, ...OFF }, pick: 'allout' },
  { id: 'walk-sand-heavy-def', tab: 'walk', state: { surface: 'sand', logKg: 7, m: 30000 } , after: () => { const s = document.getElementById('step-effort'); s.value = '1'; s.dispatchEvent(new Event('input', { bubbles: true })); } },
  { id: 'walk-sand-heavy-off', tab: 'walk', state: { surface: 'sand', logKg: 7, m: 30000, ...OFF }, after: () => { const s = document.getElementById('step-effort'); s.value = '1'; s.dispatchEvent(new Event('input', { bubbles: true })); } },
  { id: 'stomp-ice-def', tab: 'stomp', state: { surface: 'ice', logKg: 7 }, pick: 'allout' },
]).then(()=>{});
