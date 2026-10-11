const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 20, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 })));
  await p.reload();
  await p.waitForTimeout(800);
  const row = await p.evaluate(() => [...document.querySelectorAll('#src-table tr')].map(r => r.textContent).find(t => /Crater size/.test(t)));
  console.log('ROW:', row); console.log('CELL:', await p.evaluate(() => [...document.querySelectorAll('#src-table tr')].find(r => /Crater size/.test(r.textContent)).lastElementChild.innerHTML));
  const txt = await p.evaluate(() => document.body.innerText);
  const tile = await p.evaluate(() => [...document.querySelectorAll('.tile')].map(t=>t.textContent).filter(t=>/Crater/.test(t))); console.log('TILE:', tile);
  const m = txt.match(/[^\n]*[Cc]rater[^\n]*/g);
  console.log((m || []).slice(0, 8).join('\n'));
  await b.close();
})();
