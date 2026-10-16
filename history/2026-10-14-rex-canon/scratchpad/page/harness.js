// runs the new shots.js block (block.js) against a page build: node harness.js <dist/index.html>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const html = process.argv[2];
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
(async () => {
  const prev = path.join(path.dirname(html), 'preview-h.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let problems = 0; const fail = (m) => { problems++; console.log('PROBLEM ' + m); }, okLog = (m) => console.log('ok   ' + m);
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); };
  const bayText = () => page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, sel === '#duo-effort' ? 'duo-bay' : 'bay'); };
  const block = fs.readFileSync(path.join(__dirname, process.argv[3] || 'block.js'), 'utf8');
  await eval('(async () => {\n' + block + '\n})()');
  console.log('problems: ' + problems);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
