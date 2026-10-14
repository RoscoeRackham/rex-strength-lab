const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const pre = () => { document.getElementById('o-own').click(); const s = document.getElementById('o-strength'); s.value = '7'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); };
const cases = [];
for (const p of ['allout', 'plaster', 'rattle', 'ground']) cases.push({ id: 'arm-pin-' + p, tab: 'arm', state: { logKg: 9 }, pre, pick: p });
cases.push({ id: 'arm-pin-off-plaster', tab: 'arm', state: { logKg: 9, ...OFF }, pre, pick: 'plaster' });
run(cases).then(()=>{});
