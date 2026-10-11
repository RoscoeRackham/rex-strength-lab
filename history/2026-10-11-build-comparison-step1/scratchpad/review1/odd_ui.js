// Loads each odd sheet through the page's own file input, types a height, presses Measure,
// and reports the status, checks, results, timing and any NaN/undefined/Infinity.
const { open, R } = require('./harness.js');
const fs = require('fs');
const cases = (process.argv[2] ? process.argv[2].split(',') : fs.readdirSync(R + '/odd').filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)));
const extra = process.argv[3] ? JSON.parse(process.argv[3]) : {};
(async () => {
  const { browser, p, errs } = await open();
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  for (const name of cases) {
    const file = fs.existsSync(name) ? name : R + '/odd/' + name + '.png';
    errs.length = 0;
    await p.setInputFiles('#file', file);
    await p.waitForFunction(() => /Loaded|not an image/.test(document.getElementById('toolStatus').textContent), null, { timeout: 30000 }).catch(() => {});
    await p.fill('#tH', extra.H || '1.80');
    if (extra.order) await p.evaluate((v) => { document.getElementById('tOrder').value = v; }, extra.order);
    if (extra.skull != null) await p.evaluate((v) => { document.getElementById('tSkull').value = v; }, extra.skull);
    const t = Date.now();
    await p.click('#measureBtn');
    let hung = false;
    await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 120000, polling: 100 }).catch(() => { hung = true; });
    const ms = Date.now() - t;
    const res = await p.evaluate(() => ({
      status: document.getElementById('toolStatus').textContent,
      checks: document.getElementById('checks').innerText.replace(/\s+/g, ' ').slice(0, 700),
      results: document.getElementById('results').innerText.replace(/\s+/g, ' ').slice(0, 900),
      viewCaps: document.getElementById('viewCaps').innerText,
      bad: (document.getElementById('tool') || document.body).innerText.match(/.{0,50}\b(NaN|undefined|Infinity|-Infinity)\b.{0,30}/g),
    }));
    console.log('=== ' + name + (hung ? ' (HUNG >120 s)' : '') + ' ' + ms + ' ms');
    console.log(JSON.stringify(res, null, 1));
    if (errs.length) console.log('console errors:', errs);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
