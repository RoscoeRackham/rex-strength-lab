const H = require('./h.js');
const readout = async (p) => { for (let i = 0; i < 60; i++) { const t = await p.evaluate(() => (document.querySelector('.effort-read') || {}).innerText || ''); if (t && !/working it out/.test(t)) return t; await p.waitForTimeout(500); } return 'TIMEOUT'; };
(async () => {
  const p = await H.open({ group: 'duo', duoAction: 'arm' });
  await H.tab(p, 'arm', true);
  console.log('--- shared least:\n' + await readout(p));
  await p.evaluate(() => { const d = document.querySelector('details.effort-adjust'); if (d) d.open = true; });
  await p.click('#o-effort-own'); await p.waitForTimeout(800);
  await p.evaluate(() => { const s = document.querySelector('#o-effort-use'); s.value = String(Math.log10(89400)); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(3000);
  console.log('--- Ollie own 89.4 t:\n' + await readout(p));
  await H.close();
})();
