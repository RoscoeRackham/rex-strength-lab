const run = require('./h.js');
const pre = () => { document.getElementById('o-own').click(); const s = document.getElementById('o-strength'); s.value = '7'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); };
run([
  { id: 'arm-pin-realground-allout', tab: 'arm', state: { logKg: 9, unbreakable: false }, pre, pick: 'allout' },
  { id: 'arm-pin-realground-custom', tab: 'arm', state: { logKg: 9, unbreakable: false }, pre, pick: 'custom', custom: Math.log10(63400e3) },
]).then(()=>{});
