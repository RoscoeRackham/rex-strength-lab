// Probe the two-player effort cap: every solo engine call made outside a two-player render or probe must get Rex's full
// strength (ctx.F = the dial's force), and every call made inside one must get at most the cap. Stack traces tell the
// contexts apart (the page is not minified). Two-player calls are slowed so its search runs in the background while
// Rex's tabs are clicked, the element is reopened and a resize happens with a typed two-player distance.
const { chromium, CHROME, wrap, settle, S } = require('./h.js');
const SOLO_FNS = ['throwObject', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'lift', 'walk', 'moveCheck'];
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'collide'];
const probe = ({ solo, duo }) => {
  window.__calls = []; window.__duoCalls = 0;
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of solo) { const f = x[k]; if (typeof f === 'function') x[k] = function (c) {
      if (c && typeof c === 'object' && 'F' in c && c.body) { const st = new Error().stack; window.__calls.push({ k, F: c.F, duoCtx: /harmAt|renderDuo/.test(st), soloCtx: /renderSolo|stepPlan|tick|thresholdDefs|computeThresholds|runFeat/.test(st) }); }
      return f.apply(this, arguments); }; }
    for (const k of duo) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; const t = performance.now(); while (performance.now() - t < 40) {} return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.addInitScript(probe, { solo: SOLO_FNS, duo: DUO_FNS });
  await page.goto(wrap(S + '/work/rex-strength-lab/dist/index.html', 'leak.html'));
  for (const duoAction of ['catch', 'wrestle', 'collide', 'arm']) {
    await page.evaluate((a) => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: a, action: 'throw', wrestleMove: 'throw' })), duoAction);
    await page.reload(); await page.waitForTimeout(100);
    for (const t of ['jump', 'sprint', 'pull', 'throw', 'lift', 'walk', 'stomp', 'punch', 'clap', 'throw']) { await page.click('#tab-' + t); await page.waitForTimeout(120); }
    await page.click('#duo > summary'); await page.waitForTimeout(200); await page.click('#duo > summary'); await page.waitForTimeout(300);
    await settle(page, 'duo-bay');
    // the nested path: a typed distance in the element commits when a redraw removes its box
    await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
    if (await page.$('#duo-near')) { await page.focus('#duo-near'); await page.keyboard.press('Control+A'); await page.keyboard.type('40'); }
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(600);
    await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(600);
    await settle(page, 'duo-bay'); await settle(page, 'bay'); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const full = window.DinoPhys.K.g * 100 * 907.18474;
      const c = window.__calls;
      const soloLow = c.filter((x) => !x.duoCtx && Math.abs(x.F / full - 1) > 1e-9);
      const duoFull = c.filter((x) => x.duoCtx);
      return { n: c.length, outsideDuo: c.filter((x) => !x.duoCtx).length, soloWithLessThanFull: soloLow.slice(0, 5), insideDuo: duoFull.length, insideDuoFs: [...new Set(duoFull.map((x) => Math.round(x.F)))].slice(0, 6), duoCalls: window.__duoCalls };
    });
    console.log(duoAction + ': ' + JSON.stringify(r));
    await page.evaluate(() => { window.__calls = []; });
  }
  console.log('errors ' + JSON.stringify(errs));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
