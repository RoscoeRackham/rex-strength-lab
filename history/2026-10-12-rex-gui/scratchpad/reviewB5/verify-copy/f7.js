const run = require('./harness.js');
const own = `(() => { document.getElementById('o-own').click(); const s = document.getElementById('o-strength'); s.value = '7'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); })()`;
run([
  { id: 'armGround', tab: 'arm', state: { logKg: 9 }, pre: own, pick: 'ground' },
  { id: 'armRattle', tab: 'arm', state: { logKg: 9 }, pre: own, pick: 'rattle' },
]).then((o) => { for (const [k, v] of Object.entries(o)) { console.log('##### ' + k); console.log(v.bay); } });
