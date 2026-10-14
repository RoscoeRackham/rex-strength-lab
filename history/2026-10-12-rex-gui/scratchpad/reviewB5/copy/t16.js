const run = require('./h.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const pre = () => { const s = document.getElementById('absorb'); s.value = 'instant'; s.dispatchEvent(new Event('change', { bubbles: true })); };
const after = () => { const b = Array.from(document.querySelectorAll('#bay .chip')).find((x) => /Dinosaur-killer/.test(x.textContent)); b && b.click(); };
run([
  { id: 'grow-instant-def', tab: 'weight', state: {}, pre, after },
  { id: 'grow-instant-off', tab: 'weight', state: OFF, pre, after },
  { id: 'grow-instant-sand-def', tab: 'weight', state: { surface: 'sand' }, pre, after },
]).then(()=>{});
