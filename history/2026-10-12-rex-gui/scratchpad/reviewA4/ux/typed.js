// Typed boxes (setIn now redraws after a timeout): focus after Enter and after Tab, in each bay and the sidebar,
// the value taken, and the live region
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const cases = [
    { name: 'Rex Throw goal (#goal)', state: { action: 'throw', duoOpen: true, duoAction: 'collide' }, prep: async (p) => { await p.click('#bay summary:has-text("Adjust effort")'); }, sel: '#goal', val: '25', key: 'goal' },
    { name: 'Rex Throw near (#near)', state: { action: 'throw', duoOpen: true, duoAction: 'collide' }, prep: async (p) => { await p.click('#bay summary:has-text("Adjust effort")'); }, sel: '#near', val: '40', key: 'near' },
    { name: 'Walk listener distance (#walk-d)', state: { action: 'walk', duoOpen: true, duoAction: 'arm' }, prep: async () => {}, sel: '#walk-d', val: '12', key: 'walkD' },
    { name: 'Two-player near box', state: { action: 'throw', duoOpen: true, duoAction: 'catch' }, prep: async (p) => { await p.click('#duo-bay summary:has-text("Adjust effort")'); }, sel: '#duo-bay input[type=number]', val: '33', key: 'near' },
    { name: 'Growth time (#grow-t)', state: { action: 'throw', absorb: 'gradual' }, prep: async (p) => { await p.evaluate(() => { document.getElementById('powers').open = true; }); await p.selectOption('#absorb', 'gradual'); await p.waitForTimeout(300); }, sel: '#grow-t', val: '120', key: 'growT' },
  ];
  for (const c of cases) for (const how of ['Enter', 'Tab']) {
    const { page, errs } = await open(browser, { w: 1280, h: 900, state: c.state });
    await page.waitForTimeout(2500);
    await c.prep(page);
    await page.waitForTimeout(800);
    const id = await page.evaluate((s) => { const n = document.querySelector(s); return n && (n.id || 'noid'); }, c.sel);
    if (!id) { console.log(c.name, how, 'NOT FOUND'); await page.context().close(); continue; }
    await page.focus(c.sel);
    await page.keyboard.press('Control+A');
    await page.keyboard.type(c.val);
    const before = await page.evaluate(() => document.activeElement.id);
    await page.keyboard.press(how);
    await page.waitForTimeout(2500);
    const r = await page.evaluate(({ key, sel }) => { const a = document.activeElement; const st = JSON.parse(localStorage.getItem('rex-lab-v1')); const box = document.querySelector(sel); return { focus: a.id || a.tagName + ':' + (a.textContent || '').slice(0, 20), fv: a.matches(':focus-visible'), saved: st[key], boxValue: box && box.value, inBody: a === document.body }; }, { key: c.key, sel: c.sel });
    console.log(c.name, '| key', how, '| focused before', before, '->', JSON.stringify(r), errs.length ? 'ERRS ' + errs.join(' | ') : '');
    await page.context().close();
  }
  await browser.close();
})();
