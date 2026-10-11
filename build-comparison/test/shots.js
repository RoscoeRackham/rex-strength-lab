// Headless render of dist/index.html: screenshots at 390 and 1280 px, light and dark, then a
// sweep of the page's controls. Fails on NaN, undefined or Infinity in the text, console errors,
// horizontal page scroll, text under 11 px on the phone, duplicate element ids, or a measuring
// tool that does not finish.
// Run from build-comparison/: node test/shots.js   (needs Playwright and its Chromium; see below)
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
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && fs.existsSync(p));
const shots = path.join(root, 'shots');
fs.mkdirSync(shots, { recursive: true });

// The artifact host wraps the page in a skeleton like this one (without a [hidden] rule: the page
// must hide its own hidden elements).
const page = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const skeleton = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}</style>' +
  '</head><body>' + page + '</body></html>';
const tmp = path.join(require('os').tmpdir(), 'build-comparison-preview.html');
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

/** Text checks that run in the page: bad values, small type, duplicate ids, horizontal scroll. */
function audit(minPx) {
  const out = { bad: [], small: [], dupIds: [], sw: document.documentElement.scrollWidth, iw: window.innerWidth };
  // All text, including closed <details> (the key, the sources) that innerText leaves out.
  const parts = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t; (t = tw.nextNode());) if (!t.parentElement.closest('script, style')) parts.push(t.textContent);
  const text = parts.join(' ').replace(/\s+/g, ' ');
  const re = /.{0,40}\b(NaN|undefined|Infinity)\b.{0,40}/g;
  let m; while ((m = re.exec(text))) out.bad.push(m[0]);
  // Claims the page must never make (the meatball is a chosen end, not a maximum).
  for (const b of ['≈', 'No body can', 'Nothing can score higher', 'impossible', 'the ceiling']) if (text.includes(b)) out.bad.push('banned phrase: ' + b);
  const seen = {};
  document.querySelectorAll('[id]').forEach((el) => { seen[el.id] = (seen[el.id] || 0) + 1; });
  out.dupIds = Object.keys(seen).filter((k) => seen[k] > 1);
  if (minPx) {
    // Every visible text node: HTML at its computed size, SVG at its size on screen.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const s = n.textContent.trim(); if (!s) continue;
      const el = n.parentElement; if (!el || el.closest('.sr, title, script, style, [hidden], details:not([open]) > :not(summary)')) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let px = parseFloat(cs.fontSize);
      if (el instanceof SVGElement) { const svg = el.ownerSVGElement || el; const ctm = el.getScreenCTM(); if (ctm) px *= Math.hypot(ctm.a, ctm.b); }
      if (px < minPx - 0.05) out.small.push(px.toFixed(1) + 'px "' + s.slice(0, 30) + '" in ' + (el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className && el.className.baseVal != null ? el.className.baseVal : el.className).split(' ')[0]));
    }
  }
  return out;
}

/** Positions that must hold: the 924 marks on every tape, and the meatball inside its drawing. */
function marks() {
  const out = {};
  const bc = window.__bc;
  for (const id of ['glance', 'locTape']) {
    const h = document.getElementById(id), c = h && h.querySelector('circle.m924');
    out[id] = c && h._X ? Math.abs(+c.getAttribute('cx') - h._X(bc.MEAT)) : null;
  }
  // In the close-up (12 to 45) the forest has no 924 line, by design.
  if (document.getElementById('zHum').getAttribute('aria-pressed') === 'true') out.forest = 0;
  const f = document.querySelector('#fp .fp-bg i.m924');
  if (f) { const bg = f.parentElement.getBoundingClientRect(), r = f.getBoundingClientRect(); const want = bg.left + bg.width * (Math.log(bc.MEAT) - Math.log(bc.AX.lo)) / (Math.log(bc.AX.hi) - Math.log(bc.AX.lo)); out.forest = Math.abs(r.left - want); }
  const mc = document.getElementById('meatCircle');
  if (mc) { const a = mc.getBoundingClientRect(), b = mc.ownerSVGElement.getBoundingClientRect(); out.meatInside = a.left >= b.left - 0.5 && a.right <= b.right + 0.5 && a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5; }
  return out;
}
function geometry(where, g) {
  for (const k of ['glance', 'locTape', 'forest']) if (!(g[k] != null && g[k] <= 1)) problems.push(`${where}: the 924 mark on ${k} is ${g[k]} px off`);
  if (g.meatInside !== true) problems.push(`${where}: the meatball is clipped by its drawing`);
}

const problems = [];
function report(where, a) {
  if (a.sw > a.iw) problems.push(`${where}: horizontal scroll ${a.sw} > ${a.iw}`);
  a.bad.forEach((b) => problems.push(`${where}: bad value "${b}"`));
  a.dupIds.forEach((d) => problems.push(`${where}: duplicate id #${d}`));
  const small = Array.from(new Set(a.small));
  if (small.length) problems.push(`${where}: ${small.length} text runs under 11 px, e.g. ` + small.slice(0, 6).join('; '));
}

(async () => {
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: w < 500 ? 2 : 1 });
      await routeFonts(ctx);
      const p = await ctx.newPage();
      const errs = [];
      p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', (e) => errs.push(String(e)));
      await p.goto(pathToFileURL(tmp).href);
      await p.evaluate(() => document.fonts.ready);
      // The measuring tool runs its example and the duo.jpg validation when it comes near the screen.
      await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
      await p.evaluate(() => { document.getElementById('tool').scrollIntoView(); });
      await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /\b(pass|fail)\b/i.test(document.getElementById('validation').textContent), null, { timeout: 60000 })
        .catch(() => problems.push(`${w} ${scheme}: the measuring tool did not finish`));
      const font = await p.evaluate(() => document.fonts.check('800 40px "Big Shoulders Display"'));
      if (!font) problems.push(`${w} ${scheme}: display font not loaded`);
      // The measurement ran in the Web Worker, not on the page (the page falls back silently).
      if ((await p.evaluate(() => window.__bc.measuredIn)) !== 'worker') problems.push(`${w} ${scheme}: the measuring tool did not run in its worker`);
      const val = await p.evaluate(() => document.getElementById('validation').textContent);
      if (!/\bpass\b/i.test(val)) problems.push(`${w} ${scheme}: duo.jpg validation did not pass: ${val}`);
      geometry(`${w} ${scheme}`, await p.evaluate(marks));
      report(`${w} ${scheme}`, await p.evaluate(audit, w < 500 ? 11 : 0));
      const file = path.join(shots, `${w}-${scheme}.png`);
      await p.screenshot({ path: file, fullPage: true });
      console.log('shot ' + path.relative(root, file));
      if (w === 390 && scheme === 'light') await sweep(p);
      errs.forEach((e) => problems.push(`${w} ${scheme}: console ${e}`));
      await ctx.close();
    }
  }
  // Tablet widths: the drawer's two-column layout must not push the page sideways.
  for (const w of [720, 768, 820, 900]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    await routeFonts(ctx);
    const p = await ctx.newPage();
    await p.goto(pathToFileURL(tmp).href);
    await p.evaluate(() => document.fonts.ready);
    const wide = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.fig[data-id]').forEach((c) => { c.click(); const sw = document.documentElement.scrollWidth; if (sw > window.innerWidth) out.push(c.getAttribute('data-id') + ' ' + sw); });
      const d = document.getElementById('drawer'); document.querySelector('#drawer .close').click();
      if (d.getBoundingClientRect().height > 0 || getComputedStyle(d).display !== 'none') out.push('closed drawer still takes space');
      return out;
    });
    wide.forEach((x) => problems.push(`${w}: details ${x}`));
    await ctx.close();
  }
  await browser.close();
  if (problems.length) { console.log('\nPROBLEMS\n' + problems.join('\n')); process.exit(1); }
  console.log('\nno problems: no NaN/undefined/Infinity, no console errors, no horizontal scroll, no phone text under 11 px');
})().catch((e) => { console.error(e); process.exit(1); });

/** Every control, every build in the details panel, both views and both height modes. */
async function sweep(p) {
  const shot = async (name) => { await p.screenshot({ path: path.join(shots, name + '.png'), fullPage: true }); console.log('shot shots/' + name + '.png'); };
  const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((c) => c.getAttribute('data-id')));
  if (ids.length !== 49) problems.push('sweep: ' + ids.length + ' figures in the lineup, expected 49');
  // Each mode must visibly change the page: a dead control fails.
  const sig = () => p.evaluate(() => document.getElementById('stops').innerHTML.length + ':' + document.documentElement.scrollHeight + ':' + document.getElementById('fp').innerHTML.length);
  const base = await sig();
  for (const [btn, back, name] of [['#hReal', '#hSame', 'real heights'], ['#vSide', '#vFront', 'side view'], ['#zHum', '#zAll', 'close-up']]) {
    await p.click(btn);
    const now = await sig();
    if (now === base) problems.push('sweep: ' + name + ' did not change the page');
    report('sweep ' + name, await p.evaluate(audit, 11));
    geometry('sweep ' + name, await p.evaluate(marks));
    await shot('390-' + name.replace(/ /g, '-'));
    await p.click(back);
  }
  if ((await sig()) !== base) problems.push('sweep: switching every mode back did not restore the page');
  // Switching a mode with a figure's details open keeps the page working (review round 1, F1).
  await p.evaluate(() => document.querySelector('.fig[data-id="ronnie_coleman"]').click());
  for (const btn of ['#hReal', '#vSide', '#vFront', '#hSame']) await p.click(btn);
  const after = await p.evaluate(() => { const d = document.getElementById('drawer'); document.querySelector('.fig[data-id="phil_heath"]').click(); const d2 = document.getElementById('drawer'); return { had: !!d, open: !!d2 && !d2.hidden && /Heath/.test((document.getElementById('drawerH') || {}).textContent || '') }; });
  if (!after.had || !after.open) problems.push('sweep: after switching modes with details open, a figure no longer opens its details: ' + JSON.stringify(after));
  await p.keyboard.press('Escape');
  // The stops come from the model: tags match the gaps, and the giants are all comic characters.
  const seq = await p.evaluate(() => { const bc = window.__bc; return { gaps: bc.GAPS.map((g) => [bc.sc(g.from), g.above ? bc.sc(g.to) : null]), tags: Array.from(document.querySelectorAll('.stop .tag')).map((t) => t.textContent), giants: Array.from(document.querySelectorAll('#giants .fig')).map((f) => f.getAttribute('data-id')), groups: bc.LIST.reduce((o, e) => (o[e.id] = e.group, o), {}) }; });
  for (const [a, b] of seq.gaps) if (!seq.tags.some((t) => t === 'Score ' + a + ' to ' + (b || '924'))) problems.push('sweep: no stop tagged for the gap ' + a + ' to ' + (b || '924') + ': ' + seq.tags.join(' | '));
  for (const id of seq.giants) if (seq.groups[id] !== 'Comic characters') problems.push('sweep: ' + id + ' is in the comic giants stop');
  // Every figure opens its details without bad values or sideways scroll; Escape closes them.
  for (const id of ids) {
    await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').click(), id);
    const a = await p.evaluate(audit, 11);
    const where = 'details ' + id;
    if (a.sw > a.iw) problems.push(`${where}: horizontal scroll`);
    a.bad.forEach((b) => problems.push(`${where}: bad value "${b}"`));
    if (await p.evaluate(() => document.getElementById('drawer').hidden)) problems.push(`${where}: did not open`);
  }
  await p.keyboard.press('Escape');
  if (!(await p.evaluate(() => document.getElementById('drawer').hidden))) problems.push('details: Escape did not close them');
  for (const [id, name] of [['rex', 'rex'], ['ollie', 'ollie'], ['hulk_savage', 'hulk'], ['ronnie_coleman', 'coleman'], ['thor', 'thor'], ['colossus_armored', 'colossus']]) {
    if (!ids.includes(id)) continue;
    await p.evaluate((id) => document.querySelector('.fig[data-id="' + id + '"]').click(), id);
    await p.waitForTimeout(100);
    await p.locator('#drawer').screenshot({ path: path.join(shots, `390-details-${name}.png`) });
    console.log(`shot shots/390-details-${name}.png`);
  }
  // A forest row opens the same details.
  await p.evaluate(() => document.querySelector('#fp [data-open="ronnie_coleman"]').click());
  if (await p.evaluate(() => document.getElementById('drawer').hidden || !/Coleman/.test(document.getElementById('drawerH').textContent))) problems.push('forest: a row did not open its details');
  await p.evaluate(() => document.querySelector('#fp [data-open="ronnie_coleman"]').focus());
  await p.keyboard.press('Enter');
  await p.keyboard.press('Escape');
  if (!(await p.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-open') === 'ronnie_coleman'))) problems.push('forest: closing the details did not return focus to the row');
  // The measuring tool with bad input says so instead of printing nonsense.
  await p.fill('#tH', '-3');
  await p.click('#measureBtn');
  if (await p.evaluate(() => document.getElementById('tH').getAttribute('aria-invalid')) !== 'true') problems.push('tool: a negative height was not flagged');
  await p.fill('#tH', '1.80');
  await p.click('#measureBtn');
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 30000 }).catch(() => problems.push('tool: re-measure did not finish'));
  // Tapping just left of the 924 ring goes to the meatball, on both tapes.
  for (const tape of ['glance', 'locTape']) {
    await p.evaluate(() => window.scrollTo(0, 0));
    if (tape === 'locTape') await p.evaluate(() => document.getElementById('under25').scrollIntoView());
    const box = await p.evaluate((id) => { const h = document.getElementById(id), r = h.getBoundingClientRect(); return { x: r.left + h._X(window.__bc.MEAT) - 3, y: r.top + r.height / 2 }; }, tape);
    await p.mouse.click(box.x, box.y);
    await p.waitForTimeout(150);
    const top = await p.evaluate(() => Math.abs(document.getElementById('meatball').getBoundingClientRect().top) < 80);
    if (!top) problems.push(`tape ${tape}: a tap on the 924 ring did not go to the meatball`);
  }
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  // Fields edited while a measurement runs: the results say they are for the old fields.
  await p.click('#measureBtn');
  await p.fill('#tH', '2.00');
  await p.waitForFunction(() => !document.getElementById('measureBtn').disabled, null, { timeout: 30000 });
  if (!/changed/.test(await p.evaluate(() => document.getElementById('toolStatus').textContent))) problems.push('tool: fields edited during a measurement were not flagged');
  await p.fill('#tH', '1.80');
  await p.click('#measureBtn');
  await p.waitForFunction(() => !document.getElementById('measureBtn').disabled && document.querySelectorAll('#results tr').length > 5, null, { timeout: 30000 });
  // Fields changed after measuring: the copy waits for a new measurement.
  await p.fill('#tH', '2.00');
  await p.click('#copyBtn');
  if (!/changed/.test(await p.evaluate(() => document.getElementById('toolStatus').textContent))) problems.push('tool: copy used results measured with other fields');
  await p.fill('#tH', '1.80');
  // A typed skull row outside the head is refused, not scored.
  await p.evaluate(() => { document.querySelector('details.adv').open = true; });
  await p.fill('#tSkull', '5000');
  await p.click('#measureBtn');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 30000 });
  if (!/outside its head/.test(await p.evaluate(() => document.getElementById('tool').innerText))) problems.push('tool: a skull row of 5000 was not refused');
  await p.fill('#tSkull', '');
  await p.click('#measureBtn');
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 30000 }).catch(() => problems.push('tool: re-measure did not finish'));
  // The target outline draws and reports its score, on a shape and at a score where one sqrt step used to miss.
  await p.selectOption('#tShape', 'ronnie_coleman');
  await p.fill('#tTarget', '300');
  await p.click('#targetBtn');
  await p.waitForFunction(() => /as drawn/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 }).catch(() => problems.push('tool: target outline did not finish'));
  const t300 = Number(((await p.evaluate(() => document.getElementById('targetStatus').textContent)).match(/scores ([\d.,]+) as drawn/) || [])[1]);
  if (!(Math.abs(t300 / 300 - 1) < 0.01)) problems.push('tool: target outline for 300 on Coleman measures ' + t300);
  await p.selectOption('#tShape', 'ansur2_m_p50');
  await p.fill('#tTarget', '60');
  await p.click('#targetBtn');
  await p.waitForFunction(() => /as drawn/.test(document.getElementById('targetStatus').textContent), null, { timeout: 30000 }).catch(() => problems.push('tool: target outline did not finish'));
  const ts = await p.evaluate(() => document.getElementById('targetStatus').textContent);
  const got = Number((ts.match(/scores ([\d.,]+) as drawn/) || [])[1]);
  if (!(Math.abs(got / 60 - 1) < 0.03)) problems.push('tool: target outline for 60 measures ' + got);
  await p.fill('#tTarget', '5');
  await p.click('#targetBtn');
  if (await p.evaluate(() => document.getElementById('tTarget').getAttribute('aria-invalid')) !== 'true') problems.push('tool: a target of 5 was not flagged');
  report('tool', await p.evaluate(audit, 11));
}
