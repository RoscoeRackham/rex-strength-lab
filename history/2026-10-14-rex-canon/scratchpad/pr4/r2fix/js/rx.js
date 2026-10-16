// node rx.js <ROOT> <state json> <pick> <selector> <regex>: tests a regex on a state's duo-bay text
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [ROOT, ST, PICK, SEL, RX] = process.argv.slice(2);
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8'), prev = path.join(__dirname, 'rx-page-' + process.pid + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify(Object.assign({ duoOpen: true }, JSON.parse(ST))));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); await page.waitForTimeout(300); await settle(page, 'duo-bay');
  if (PICK && PICK !== '-') { await page.selectOption('#duo-effort', PICK); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
  const t = await page.evaluate((s) => s === 'all' ? document.getElementById('duo-bay').textContent.replace(/\s+/g, ' ') : Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), SEL);
  const re = new RegExp(RX);
  console.log(re.test(t) ? 'MATCH' : 'NO MATCH'); const i = t.search(/Damage radius|meets real air/); console.log(t.slice(Math.max(0, i - 50), i + 400));
  await browser.close(); fs.unlinkSync(prev);
})();
