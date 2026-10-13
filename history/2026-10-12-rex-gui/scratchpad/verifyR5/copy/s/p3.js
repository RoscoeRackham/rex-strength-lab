const run = require('./harness.js');
const set = `(() => { const a = document.getElementById('absorb'); a.value = 'instant'; a.dispatchEvent(new Event('change', { bubbles: true })); })()`;
const pick = (re) => `(() => { const b = [...document.querySelectorAll('button, [role=radio], label')].find(x => ${re}.test(x.textContent)); if (b) b.click(); else console.error('no chip'); })()`;
const cases = [];
for (const [sf, ub] of [['concrete', true], ['concrete', false], ['ice', true], ['sand', true], ['steel', true]]) for (const chip of ['/Dinosaur-killer/i', '/Hiroshima/i'])
  cases.push({ id: 'grow-' + sf + '-' + ub + '-' + chip.replace(/\W/g, ''), tab: 'weight', state: { surface: sf, unbreakable: ub }, pre: set, after: pick(chip) });
run(cases).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay.split('\n').filter(l => /grows|soles|rough estimate|reaches the ground|rise|ground-wave|It becomes/i.test(l)).join('\n')); } });
