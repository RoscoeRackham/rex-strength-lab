// Does moving a Rex-only control (his Throw effort slider) redraw the Rex + Ollie element, and how much main-thread
// time does that cost? Compared with the element closed, and with main's page (one bay at a time).
const { chromium, CHROME, wrap, settle, S } = require('./h.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names }) => {
  window.__duoCalls = 0; window.__long = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(e.duration); }).observe({ type: 'longtask', buffered: false }); } catch (e) {}
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; return f.apply(this, arguments); }; }
    v = x;
  } });
};
(async () => {
  const duoTab = process.argv[2] || 'catch';
  const browser = await chromium.launch({ executablePath: CHROME });
  const runs = [
    ['branch, element open', S + '/work/rex-strength-lab/dist/index.html', { duoOpen: true, duoAction: duoTab, action: 'throw' }],
    ['branch, element closed', S + '/work/rex-strength-lab/dist/index.html', { duoOpen: false, duoAction: duoTab, action: 'throw' }],
    ['main, Rex alone', S + '/main-dist.html', { group: 'solo', duoAction: duoTab, action: 'throw' }],
  ];
  for (const [label, src, st] of runs) {
    const url = wrap(src, 'lag-' + label.replace(/\W+/g, '_') + '.html');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(countDuoCalls, { names: DUO_FNS });
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(1500);
    await settle(page, 'bay'); if (st.duoOpen) await settle(page, 'duo-bay');
    await page.waitForTimeout(1500);
    await page.evaluate(() => { document.querySelector('#bay details.effort-adjust').open = true; });
    await page.focus('#effort-use');
    const c0 = await page.evaluate(() => { window.__long = []; return window.__duoCalls; });
    const t0 = Date.now();
    // 20 key presses 50 ms apart, as a reader nudging the slider
    for (let i = 0; i < 20; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(50); }
    const tKeys = Date.now() - t0;
    await page.waitForTimeout(3000);
    const r = await page.evaluate((c0) => ({ duoCalls: window.__duoCalls - c0, longTasks: window.__long.length, longMs: Math.round(window.__long.reduce((a, b) => a + b, 0)), maxLong: Math.round(Math.max(0, ...window.__long)), focus: document.activeElement && document.activeElement.id }), c0);
    console.log(label + ' (' + duoTab + '): ' + JSON.stringify(Object.assign(r, { msForKeys: tKeys })));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
