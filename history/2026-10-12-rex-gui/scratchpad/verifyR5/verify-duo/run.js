const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const V = __dirname;
const html = fs.readFileSync(path.join(V, 'lab/dist/index.html'), 'utf8');
const page = path.join(V, 'page.html');
fs.writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
    await p.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true }, st))); } catch (e) {} }, c.state);
    await p.goto('file://' + page);
    const waitDone = async () => { await p.waitForTimeout(500); for (let i = 0; i < 600; i++) { const t = await p.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await p.waitForTimeout(500); } };
    await waitDone();
    if (c.effort) { await p.selectOption('#duo-effort', c.effort); await waitDone(); }
    const info = await p.evaluate(() => {
      const duo = document.getElementById('duo');
      const t = duo.innerText;
      const lis = [...duo.querySelectorAll('ul.happens li')].map((li) => li.textContent);
      const chips = [...duo.querySelectorAll('.status-row')].map((r) => r.innerText.replace(/\n+/g, ' | '));
      const eff = [...duo.querySelectorAll('.effort-read')].map((r) => r.innerText);
      return { hasTk: t.includes('The take-off goes into the ground too'), lis, chips, eff };
    });
    console.log('=== ' + c.name);
    console.log('take-off item in DOM:', info.hasTk);
    console.log('effort:', info.eff.join('\n'));
    console.log('chips:', info.chips.join('\n'));
    info.lis.forEach((l, i) => console.log('  item ' + (i + 1) + ': ' + (l.includes('Unbreakable footing:') || l.includes('take-off') ? l : l.slice(0, 120))));
    if (errs.length) console.log('errors:', errs);
    await ctx.close();
  }
  await b.close();
})();
