const pw = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const S = __dirname;
const html = fs.readFileSync(path.join(S, 'lab/dist/index.html'), 'utf8');
const file = path.join(S, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto('file://' + file);
    await p.evaluate((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, c.state);
    await p.reload();
    if (c.effort) { await p.selectOption('#duo-effort', c.effort); }
    await p.waitForFunction(() => !document.body.innerText.includes('working it out'), null, { timeout: 120000 });
    await p.waitForTimeout(500);
    const txt = await p.evaluate(() => document.body.innerText);
    const lines = txt.split('\n').filter((l) => /Landing|Where he lands|ground under him|ground’s problem|Lands at|Distance|Impact:/.test(l));
    console.log('=== ' + c.name);
    for (const l of lines) console.log('  ' + l.slice(0, 700));
    await p.close();
  }
  await b.close();
})();
