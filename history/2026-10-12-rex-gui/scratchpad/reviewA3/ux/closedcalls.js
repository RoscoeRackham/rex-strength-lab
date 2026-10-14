const { launch, open } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const count = ({ names }) => { window.__duoCalls = 0; let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const b = await launch();
  for (const st of [null, { duoAction: 'catch', duoOpen: false, mode: 'real', cObj: 'bus' }]) {
    const page = await open(b, { w: 390, h: 844, state: st, wait: 2500, init: { fn: count, arg: { names: DUO_FNS } } });
    const log = [];
    const c = async (what) => { await page.waitForTimeout(700); log.push(what + '=' + (await page.evaluate(() => window.__duoCalls))); };
    await c('load');
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    for (const id of ids) { await page.click('#tier-chips .chip[data-id="' + id + '"]'); }
    await c('all chips');
    await page.selectOption('#surface', { index: 4 }); await c('surface');
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.check('#bolt-rex'); await page.check('#bolt-ollie'); await page.check('#ground-holds'); await page.click('#mode-real'); await c('powers');
    for (const t of ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight']) await page.click('#tab-' + t);
    await c('Rex tabs');
    await page.click('#tab-walk'); await page.waitForTimeout(400);
    const walkBoth = await page.$('#bay button.chip:has-text("Both together")'); if (walkBoth) { await walkBoth.click(); } await c('walk both');
    await page.setViewportSize({ width: 1280, height: 900 }); await c('resize');
    await page.click('#duo > summary'); await c('opened');
    console.log(JSON.stringify(st), log.join(' '), page.errs);
    await page.context().close();
  }
  await b.close();
})();
