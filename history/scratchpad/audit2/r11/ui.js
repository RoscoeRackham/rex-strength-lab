const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 8.77, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'punch' })); });
  await p.reload(); await p.waitForTimeout(1200);
  const row = await p.evaluate(() => [...document.querySelectorAll('#sources tr')].map(r => r.innerText).find(t => /Air heating/.test(t)));
  console.log('SOURCES ROW:', row);
  const tile = await p.evaluate(() => { const t = [...document.querySelectorAll('*')].filter(e => e.children.length < 6 && /Air at the knuckles/.test(e.innerText||'')); return t.length ? t[t.length-1].parentElement.innerText : null; });
  console.log('PUNCH TILE:', tile);
  await b.close();
})();
