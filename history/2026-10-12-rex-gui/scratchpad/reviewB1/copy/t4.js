const H = require('./h.js');
(async () => {
  const p = await H.open({ state: { groundHolds: false, gentleHold: false, coolFlight: true, softLanding: true, action: 'throw' } });
  const r = await p.evaluate(() => ({ sum: document.getElementById('powers-sum').textContent, ub: document.getElementById('sw-unbreakable').checked, rc: document.getElementById('sw-recoil').checked, kf: document.getElementById('sw-keep').checked, air: document.getElementById('air-absorb').value, soft: document.getElementById('sw-soft').checked }));
  console.log(JSON.stringify(r));
  await p.evaluate(() => { document.getElementById('powers').open = true; }); await p.click('#sw-keep'); await p.waitForTimeout(300);
  console.log('saved:', await p.evaluate(() => localStorage.getItem('rex-lab-v1')));
  // all four off
  await p.click('#sw-unbreakable'); await p.click('#sw-recoil');
  await p.$eval('#air-absorb', (n) => { n.value = 0; n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(300);
  console.log('sum all off:', await p.$eval('#powers-sum', (n) => n.textContent));
  await p.click('#sw-soft'); await p.waitForTimeout(200);
  console.log('sum all off, soft off:', await p.$eval('#powers-sum', (n) => n.textContent));
  // keyboard on slider
  await p.evaluate(() => { document.getElementById('powers').open = true; });
  await p.focus('#air-absorb'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400);
  console.log('after 2x right:', await p.evaluate(() => ({ v: document.getElementById('air-absorb').value, vt: document.getElementById('air-absorb').getAttribute('aria-valuetext'), saved: JSON.parse(localStorage.getItem('rex-lab-v1')).airAbsorb })));
  await H.close();
})();
