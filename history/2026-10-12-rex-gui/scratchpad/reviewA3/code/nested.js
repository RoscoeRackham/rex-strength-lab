// Rex's distance box with a typed, uncommitted value when a redraw removes it (a resize): main vs the branch, and the
// two-player box with the element open (does Rex's bay or the element end up with doubled content?)
const { chromium, CHROME, wrap, settle, S } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [label, src, st, box, bayId] of [
    ['main solo', S + '/main-dist.html', { action: 'stomp', group: 'solo' }, '#near', 'bay'],
    ['branch solo', S + '/work/rex-strength-lab/dist/index.html', { action: 'stomp' }, '#near', 'bay'],
    ['branch duo', S + '/work/rex-strength-lab/dist/index.html', { action: 'stomp', duoOpen: true, duoAction: 'catch' }, '#duo-near', 'duo-bay'],
    ['main duo', S + '/main-dist.html', { action: 'stomp', group: 'duo', duoAction: 'catch' }, '#near', 'bay'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(wrap(src, 'nested-' + label.replace(/\W/g, '') + '.html'));
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(800); await settle(page, bayId); await settle(page, 'bay');
    await page.evaluate((id) => { const d = document.querySelector('#' + id + ' details.effort-adjust'); if (d) d.open = true; }, bayId);
    await page.focus(box); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(1200); await settle(page, bayId); await settle(page, 'bay');
    const r = await page.evaluate((id) => { const b = document.getElementById(id); return { verdicts: b.querySelectorAll(':scope > .verdict').length, controls: b.querySelectorAll(':scope > .bay-controls').length, children: b.children.length, near: JSON.parse(localStorage.getItem('rex-lab-v1')).near, boxValue: (b.querySelector('input[type=number][id$="near"]') || {}).value, rexEffort: !!document.querySelector('#bay .effort-read'), dup: (() => { const seen = {}; for (const n of document.querySelectorAll('[id]')) seen[n.id] = (seen[n.id] || 0) + 1; return Object.keys(seen).filter((k) => seen[k] > 1); })() }; }, bayId);
    console.log(label + ': ' + JSON.stringify(r) + ' errors ' + JSON.stringify(errs));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
