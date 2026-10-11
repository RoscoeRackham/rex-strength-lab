const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url'), { execSync } = require('child_process');
// Playwright: $PLAYWRIGHT, the cloud sandbox's copy, a local install, or a global `npm install -g playwright`.
const loadPlaywright = () => {
  for (const p of [process.env.PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright']) { if (p) try { return require(p); } catch (e) { /* next */ } }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
};
const { chromium } = loadPlaywright();
// Chromium: $CHROME, the cloud sandbox's build, or Playwright's own (npx playwright install chromium).
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && fs.existsSync(p));
(async () => {
  const body = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, '..', 'dist', 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const out = path.join(__dirname, '..', 'shots'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const only = process.argv[2];
  let problems = 0;
  // 1280 px and 390 px, light and dark; every tab. Fails on horizontal scroll, console errors, or broken numbers
  // (NaN, undefined, a bare Infinity) in the page text.
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
  const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
  for (const [w, h, scheme] of [[1280, 900, 'light'], [1280, 900, 'dark'], [390, 844, 'light'], [390, 844, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.goto(pathToFileURL(prev).href);
    await page.waitForTimeout(3000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const texts = [];
    if (!only) await page.screenshot({ path: path.join(out, `full-${w}-${scheme}.png`), fullPage: true });
    for (const tab of (only ? [only] : SOLO.concat(DUO))) {
      const duo = DUO.includes(tab);
      await page.click(duo ? '#grp-duo' : '#grp-solo');
      await page.click('#tab-' + tab);
      await page.waitForTimeout(duo ? 900 : 400);
      // the whole page, not only the bay: header, dial, settings, switches, ladder and sources too
      const t = await page.evaluate(() => document.body.innerText);
      const b = bad(t);
      if (b.length) texts.push(tab + ': ' + b.join(', '));
      const bay = await page.$('main.panel');
      if (scheme === 'light' || w === 390) await bay.screenshot({ path: path.join(out, `${tab}-${w}-${scheme}.png`) });
    }
    const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${w}x${h} ${scheme}: overflow=${Math.max(overflow, ov2)}px errors=${JSON.stringify(errs.slice(0, 5))} broken-text=${JSON.stringify(texts)}`);
    if (overflow > 0 || ov2 > 0 || errs.length || texts.length) problems++;
    await page.close();
  }
  await browser.close();
  if (problems) { console.log('PROBLEMS: overflow, console errors or broken text above'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
