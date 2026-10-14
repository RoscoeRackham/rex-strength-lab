const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const { CASES, DUO, readResult, settle } = require(ROOT + '/test/make-page-fixture.js');
const BEFORE = JSON.parse(fs.readFileSync(ROOT + '/test/fixtures/page-before.json', 'utf8')).results;
(async () => {
  const body = fs.readFileSync(ROOT + '/dist/index.html', 'utf8');
  const prev = path.join(__dirname, 'p.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const c of CASES) {
    const duo = DUO.includes(c.tab);
    const st = Object.assign({}, c.state, duo ? { duoOpen: true, duoAction: c.tab } : { action: c.tab });
    delete st.group;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(900);
    const id = duo ? 'duo-bay' : 'bay';
    await settle(page, id);
    const now = await readResult(page, id), was = BEFORE[c.id];
    for (const k of Object.keys(was)) {
      const a = JSON.stringify(was[k]), b = JSON.stringify(now[k]);
      if (a !== b) {
        // print a word diff
        const A = (Array.isArray(was[k]) ? was[k].join(' ¶ ') : String(was[k])), B = (Array.isArray(now[k]) ? now[k].join(' ¶ ') : String(now[k]));
        let i = 0; while (i < A.length && A[i] === B[i]) i++;
        let j = 0; while (j < A.length - i && j < B.length - i && A[A.length - 1 - j] === B[B.length - 1 - j]) j++;
        console.log(c.id, k, '\n   WAS: …' + A.slice(Math.max(0, i - 40), A.length - j + 20) + '\n   NOW: …' + B.slice(Math.max(0, i - 40), B.length - j + 20));
      }
    }
  }
  await browser.close();
})();
