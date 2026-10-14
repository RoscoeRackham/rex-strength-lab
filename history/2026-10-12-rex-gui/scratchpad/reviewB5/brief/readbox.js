const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const body = fs.readFileSync(path.join(__dirname, 'repo', 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'prev-box.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settle = async (id) => { for (let i = 0; i < 400; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } console.log('TIMEOUT'); };
  for (const c of cases) {
    const duo = ['arm','wrestle','catch','collide'].includes(c.tab), bay = duo ? 'duo-bay' : 'bay';
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, Object.assign({}, c.state, duo ? { duoOpen: true, duoAction: c.tab } : { action: c.tab }));
    await page.reload(); await page.waitForTimeout(500); await settle(bay);
    for (const a of c.actions || []) { if (a.select) await page.selectOption(a.select, a.value); if (a.eval) await page.evaluate(a.eval); await page.waitForTimeout(a.wait || 400); await settle(bay); }
    const t = await page.evaluate((id) => { const b = document.getElementById(id); return { box: Array.from(b.querySelectorAll('.effort-read')).map((n) => n.innerText.replace(/\s+/g, ' ')).join(' | '), verdict: (b.querySelector('.verdict') || {}).innerText, chips: Array.from(b.querySelectorAll('.status-row')).map((n) => n.innerText.replace(/\s+/g, ' ')).join(' / ') }; }, bay);
    console.log('=== ' + c.id + '\nV: ' + t.verdict + '\nC: ' + t.chips + '\nB: ' + t.box);
  }
  await browser.close();
})();
