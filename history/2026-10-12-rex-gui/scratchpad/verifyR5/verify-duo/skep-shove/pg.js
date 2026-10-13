const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const scen = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto('file://' + path.resolve(__dirname, 'page.html'));
  const settle = async (id) => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  for (const s of scen) {
    await page.evaluate((st) => localStorage.setItem('rex-lab-v1', JSON.stringify(st)), Object.assign({ duoOpen: true }, s.state));
    await page.reload(); await page.waitForTimeout(800); await settle('duo-bay');
    if (s.effort) { await page.selectOption('#duo-effort', s.effort); await page.waitForTimeout(400); await settle('duo-bay'); }
    const r = await page.evaluate(() => {
      const bay = document.getElementById('duo-bay');
      const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
      return { verdict: txt(bay.querySelector('.verdict')), status: Array.from(bay.querySelectorAll('.status')).map(txt), happens: Array.from(bay.querySelectorAll('.happens li')).map(txt) };
    });
    console.log('=== ' + s.name);
    console.log('VERDICT: ' + r.verdict);
    console.log('CHIPS: ' + r.status.join(' | '));
    console.log('ITEMS:\n  ' + r.happens.join('\n  '));
    if (errs.length) { console.log('ERRORS: ' + errs.join(' ; ')); errs.length = 0; }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
