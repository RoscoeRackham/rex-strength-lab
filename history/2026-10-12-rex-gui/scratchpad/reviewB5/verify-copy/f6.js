const run = require('./harness.js');
const set = `(() => { const a = document.getElementById('absorb'); a.value = 'instant'; a.dispatchEvent(new Event('change', { bubbles: true })); })()`;
const pick = `(() => { const b = [...document.querySelectorAll('button, [role=radio], label')].find(x => /Dinosaur-killer/i.test(x.textContent)); if (b) b.click(); else console.error('no chip'); })()`;
run([
  { id: 'growOn', tab: 'weight', state: {}, pre: set, after: pick },
  { id: 'growOff', tab: 'weight', state: { unbreakable: false }, pre: set, after: pick },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /grows|soles|rough estimate|reaches the ground|rise/i.test(l)).join('\n')); } });
