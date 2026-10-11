// Headless render of dist/index.html: screenshots at 390 and 1280 px, light and dark,
// plus a sweep of every build in both unit systems that fails on NaN, undefined,
// Infinity, console errors or horizontal page scroll.
// Run: node test/shots.js   (needs Playwright and its Chromium; see below)
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { execFileSync, execSync } = require('child_process');

// Playwright: $PLAYWRIGHT, the cloud sandbox's copy, a local install, or a global `npm install -g playwright`.
function loadPlaywright() {
  for (const p of [process.env.PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright']) {
    if (p) try { return require(p); } catch (e) { /* next */ }
  }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const { chromium } = loadPlaywright();

const root = path.join(__dirname, '..');
// Chromium: $CHROME, the cloud sandbox's build, or Playwright's own (npx playwright install chromium).
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p => p && fs.existsSync(p));
const shots = path.join(root, 'shots');
fs.mkdirSync(shots, { recursive: true });

// The artifact host wraps the page in a skeleton like this one.
const page = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const skeleton = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>' +
  '</head><body>' + page + '</body></html>';
const tmp = path.join(require('os').tmpdir(), 'build-calc-preview.html');
fs.writeFileSync(tmp, skeleton);

// Fonts come through curl (which trusts the proxy CA) so Chromium needs no network setup.
const cache = {};
async function routeFonts(ctx) {
  await ctx.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async (route) => {
    const url = route.request().url();
    try {
      if (!cache[url]) {
        const body = execFileSync('curl', ['-sS', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', url], { maxBuffer: 1 << 24 });
        cache[url] = { body, type: url.includes('googleapis') ? 'text/css' : (url.endsWith('.woff2') ? 'font/woff2' : 'font/ttf') };
      }
      await route.fulfill({ status: 200, body: cache[url].body, contentType: cache[url].type, headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { await route.abort(); }
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const problems = [];
  const views = [[390, 844], [1280, 900]];
  for (const [w, h] of views) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: w < 500 ? 2 : 1 });
      await routeFonts(ctx);
      const p = await ctx.newPage();
      const errs = [];
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', e => errs.push(String(e)));
      await p.goto(pathToFileURL(tmp).href);
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(300);
      const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, font: document.fonts.check('800 40px "Big Shoulders Display"') }));
      if (info.sw > info.iw) problems.push(`${w} ${scheme}: horizontal scroll ${info.sw} > ${info.iw}`);
      if (!info.font) problems.push(`${w} ${scheme}: display font not loaded`);
      errs.forEach(e => problems.push(`${w} ${scheme}: console ${e}`));
      const file = path.join(shots, `${w}-${scheme}.png`);
      await p.screenshot({ path: file, fullPage: true });
      console.log('shot ' + path.relative(root, file));
      if (w === 1280 && scheme === 'light') {
        // other modes: average soldier, hidden beyond-data girths, metric, reverse buttons
        await p.click('#opts summary');
        await p.check('#modeAnsur');
        await p.uncheck('#showBeyond');
        await p.click('#uMet');
        await p.selectOption('#buildSelect', 'hulk_savage');
        await p.click('#revAnsurF');
        let t = await p.evaluate(() => document.getElementById('sheet').innerText);
        if (/NaN|undefined|Infinity/.test(t)) problems.push('modes: bad text');
        const unk = await p.evaluate(() => document.querySelectorAll('.g .v1.unk').length);
        if (unk !== 7) problems.push('hidden beyond-data girths: expected 7 unknown, got ' + unk);
        await p.screenshot({ path: path.join(shots, '1280-modes.png'), fullPage: true });
        console.log('shot shots/1280-modes.png');
        await p.check('#modeGeo'); await p.check('#showBeyond'); await p.click('#uImp');
        // the panel never hides options behind an inner scroll
        const pan = await p.evaluate(() => { const el = document.querySelector('.panel'); const cs = getComputedStyle(el); return { ov: cs.overflowY, fits: el.offsetHeight <= window.innerHeight - 32, pos: cs.position }; });
        if (pan.ov !== 'visible' || (!pan.fits && pan.pos === 'sticky')) problems.push('panel clips its options: ' + JSON.stringify(pan));
        await p.selectOption('#buildSelect', 'ronnie_coleman');
      }
      if (w === 390 && scheme === 'light') {
        // sweep every build, both units
        const ids = await p.evaluate(() => window.BUILD_DATA.builds.map(b => b.id));
        for (const units of ['imperial', 'metric']) {
          await p.click(units === 'imperial' ? '#uImp' : '#uMet');
          for (const id of ids) {
            await p.selectOption('#buildSelect', id);
            const r = await p.evaluate(() => ({ text: document.getElementById('sheet').innerText + document.querySelector('.panel').innerText, sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
            const m = r.text.match(/.{0,40}(NaN|undefined|Infinity).{0,40}/);
            if (m) problems.push(`${id} ${units}: "${m[0]}"`);
            if (r.sw > r.iw) problems.push(`${id} ${units}: horizontal scroll ${r.sw} > ${r.iw}`);
          }
        }
        // a few extra views worth looking at
        for (const [id, name] of [['hulk_savage', 'hulk'], ['rex', 'rex'], ['she_hulk', 'shehulk'], ['ansur2_m_p50', 'ansur50']]) {
          await p.click('#uImp');
          await p.selectOption('#buildSelect', id);
          await p.waitForTimeout(100);
          await p.screenshot({ path: path.join(shots, `390-${name}.png`), fullPage: true });
          console.log('shot shots/390-' + name + '.png');
        }
        // regressions from the page audit
        await p.click('#uImp');
        await p.selectOption('#buildSelect', 'ansur2_m_p50');
        await p.fill('#bfIn', '12');
        const st = await p.evaluate(() => ({ h: document.querySelector('#stats .chip').innerText.toLowerCase(), g: Array.from(document.querySelectorAll('#girths .meta .chip:first-child')).map(c => c.innerText.toLowerCase()) }));
        if (st.h !== 'measured' || st.g.some(x => x !== 'measured')) problems.push('typing body fat changed reference statuses: ' + JSON.stringify(st));
        await p.fill('#bfIn', '');
        await p.fill('#buildSearch', 'j');
        if (await p.evaluate(() => document.getElementById('buildSelect').value) !== 'ansur2_m_p50') problems.push('typing in search switched the build');
        await p.fill('#buildSearch', '');
        await p.focus('#girths .g:first-child'); await p.keyboard.press('Shift+Tab');
        if (await p.evaluate(() => document.activeElement.tagName.toLowerCase()) === 'svg') problems.push('body svg is a tab stop');
        await p.fill('#hFt', '0'); await p.fill('#hIn', '19.7');
        const fl = await p.evaluate(() => document.getElementById('bFlags').innerText);
        if (!/beyond human girth data/i.test(fl)) problems.push('0.5 m height not flagged beyond human data');
        await p.screenshot({ path: path.join(shots, '390-h05m.png'), fullPage: true });
        console.log('shot shots/390-h05m.png');
        await p.click('#hReset');
        // height change, weight override, reverse edit
        await p.selectOption('#buildSelect', 'ronnie_coleman');
        await p.fill('#hFt', '6'); await p.fill('#hIn', '6');
        await p.fill('#rg_arm_flexed', '20');
        const t = await p.evaluate(() => document.getElementById('sheet').innerText);
        if (/NaN|undefined|Infinity/.test(t)) problems.push('after edits: bad text');
        await p.screenshot({ path: path.join(shots, '390-edited.png'), fullPage: true });
        console.log('shot shots/390-edited.png');
        if (errs.length) errs.forEach(e => problems.push('sweep console ' + e));
      }
      await ctx.close();
    }
  }
  await browser.close();
  if (problems.length) { console.log('\nPROBLEMS\n' + problems.join('\n')); process.exit(1); }
  console.log('\nno problems: no NaN/undefined/Infinity, no console errors, no horizontal scroll');
})().catch(e => { console.error(e); process.exit(1); });
