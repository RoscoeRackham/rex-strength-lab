const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/out/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  await p.waitForTimeout(1500);
  const tabs = await p.$$eval('#tabs .tab', (els) => els.map((e) => e.id));
  console.log('tabs', tabs);
  for (const t of tabs) {
    await p.click('#' + t);
    // wait for background searches
    for (let i = 0; i < 60; i++) { const w = await p.evaluate(() => /working it out/i.test(document.querySelector('#bay').innerText)); if (!w) break; await p.waitForTimeout(500); }
    // open all details in bay
    await p.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    await p.waitForTimeout(300);
    const txt = await p.evaluate(() => document.querySelector('#bay').innerText);
    fs.writeFileSync(OUT + 'tab-' + t + '.txt', txt);
  }
  const rows = await p.evaluate(() => {
    const out = [];
    for (const tr of document.querySelectorAll('#sources table tr')) out.push([...tr.querySelectorAll('td')].map((td) => td.innerText.replace(/\s+/g, ' ')).join(' | ') + ' || ' + [...tr.querySelectorAll('a')].map((a) => a.href).join(' '));
    return out;
  });
  fs.writeFileSync(OUT + 'sources.txt', rows.join('\n'));
  const assum = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(OUT + 'body.txt', assum);
  console.log('errors', errs);
  await b.close();
})();
