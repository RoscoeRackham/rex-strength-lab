// crops of both pictures at none / middling / full, 390 and 1280 px, light and dark, reduced motion
const L = require('./lib.js'), fs = require('fs');
const OUT = L.SD + '/out/crops'; fs.mkdirSync(OUT, { recursive: true });
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
const HERO = [
  ['h0-walk', { action: 'walk' }],
  ['h1-car-least', { action: 'throw', obj: 'car' }],
  ['h2-stomp9', { action: 'stomp', logKg: 9 }, 'allout'],
  ['h3-krakatoa', { action: 'weight' }, null, 'krakatoa'],
  ['h4-chicxulub', { action: 'weight' }, null, 'chicxulub'],
  ['h5-throw-inf', { action: 'throw', obj: 'car', inf: true }, 'allout'],
];
const COL = [
  ['c0-push', { action: 'walk', duoOpen: true, duoAction: 'collide', colMode: 'push' }],
  ['c1-ollie-01c', { action: 'walk', duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: gb01 }, 'allout'],
  ['c2-gb1e4', { action: 'walk', duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }, 'allout'],
  ['c3-rex-sprint', { action: 'walk', duoOpen: true, duoAction: 'collide', colWho: 'rex' }, 'allout'],
];
(async () => {
  const browser = await L.launch();
  const res = {};
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: h }, reducedMotion: 'reduce', colorScheme: scheme, deviceScaleFactor: 2 });
    for (const [nm, st, eff, grow] of HERO.concat(COL)) {
      await L.load(pg, st, eff);
      if (grow) {
        await pg.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; });
        await pg.click('#grow-what-' + grow);
        await pg.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 });
      }
      await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const col = nm.startsWith('c');
      const sel = col ? '#duo-bay .art-figure .glow-art' : '#hero-art';
      const info = await pg.evaluate((s) => {
        const b = document.querySelector(s); if (!b) return null;
        b.scrollIntoView({ block: 'center' });
        const r = b.getBoundingClientRect(), g = b.querySelector('.glow');
        const spots = g ? Array.from(g.children).map((i) => { const q = i.getBoundingClientRect(); return { f: i.dataset.f, cx: (q.x + q.width / 2 - r.x) / r.width, cy: (q.y + q.height / 2 - r.y) / r.height, w: q.width, h: q.height, out: q.x < r.x || q.y < r.y || q.right > r.right || q.bottom > r.bottom }; }) : [];
        return { rect: [r.x, r.y, r.width, r.height], strength: g ? g.dataset.strength : null, glow: g ? g.style.getPropertyValue('--glow') : null, hidden: g ? g.hidden : null, opacity: g ? getComputedStyle(g).opacity : null, spots, sx: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      }, sel);
      const r = await pg.evaluate((s) => { const q = document.querySelector(s).getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; }, sel);
      const m = 14;
      const clip = { x: Math.max(0, r[0] - m), y: Math.max(0, r[1] - m), width: r[2] + 2 * m, height: r[3] + 2 * m };
      await pg.screenshot({ path: `${OUT}/${nm}-${w}-${scheme}.png`, clip });
      res[`${nm}-${w}-${scheme}`] = info;
    }
    if (pg.errs.length) console.log('errors', w, scheme, pg.errs);
    await pg.close();
  }
  fs.writeFileSync(L.SD + '/out/render.json', JSON.stringify(res, null, 1));
  for (const [k, v] of Object.entries(res)) console.log(k, v && { rect: v.rect.map((x) => +x.toFixed(1)), s: v.strength && Number(v.strength).toFixed(4), glow: v.glow && Number(v.glow).toFixed(4), hidden: v.hidden, op: v.opacity, out: v.spots.filter((x) => x.out).length, sx: v.sx });
  await browser.close();
})();
