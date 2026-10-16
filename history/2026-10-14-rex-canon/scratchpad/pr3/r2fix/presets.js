// the effort box of a few states on two builds: node presets.js <dirA> <dirB>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const states = [
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, airAbsorb: 0.999 },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, airAbsorb: 0.5 },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 20, cLogD: 5, airAbsorb: 0.99 },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 34, cLogD: 4.5 },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, inf: true, cLogD: 4.5 },
  { saveV: 3, action: 'throw', obj: 'person', logKg: 9.15, surface: 'granite' },
  { saveV: 3, action: 'throw', obj: 'person', logKg: 5.5, angle: 0 },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const out = {};
  for (const ROOT of process.argv.slice(2)) {
    const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8'), prev = path.join(__dirname, 'p-' + path.basename(path.dirname(ROOT)) + '.html');
    fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
    const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(prev).href);
    out[ROOT] = [];
    for (const st of states) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
      if (st.duoOpen) await settle(page, 'duo-bay');
      const opts = await page.evaluate((d) => Array.from(document.querySelectorAll(d ? '#duo-effort option' : '#effort option')).map((o) => o.textContent + '=' + (o.disabled ? 'off' : 'on')).join('; '), !!st.duoOpen);
      const eff = await page.evaluate((d) => (document.querySelector(d ? '#duo-bay .effort-read' : '#bay .effort-read') || {}).textContent || '', !!st.duoOpen);
      // each preset: the effort it picks
      const picks = [];
      for (const v of await page.evaluate((d) => Array.from(document.querySelectorAll(d ? '#duo-effort option' : '#effort option')).map((o) => o.value), !!st.duoOpen)) {
        if (v === 'custom') continue;
        await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', v); await page.waitForTimeout(300); await settle(page, st.duoOpen ? 'duo-bay' : 'bay');
        picks.push(v + ': ' + ((await page.evaluate((d) => (document.querySelector(d ? '#duo-bay .effort-read' : '#bay .effort-read') || {}).textContent || '', !!st.duoOpen)).match(/^[^.]*\.[^.]*\./) || [''])[0].replace(/\s+/g, ' '));
      }
      out[ROOT].push(JSON.stringify(st) + '\n  ' + picks.join('\n  ') + '\n  CEIL ' + ((eff.match(/Courtesy ceiling[^.]*\.[^.]*\./) || [''])[0]));
    }
    await page.close();
  }
  await browser.close();
  const [a, b] = Object.keys(out);
  for (let i = 0; i < states.length; i++) console.log((out[a][i] === out[b][i] ? 'SAME ' : 'DIFF ') + out[a][i] + (out[a][i] === out[b][i] ? '' : '\n  vs\n' + out[b][i]));
})();
