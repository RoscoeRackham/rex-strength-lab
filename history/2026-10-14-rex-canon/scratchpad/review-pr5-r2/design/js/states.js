// the glow never sticks: tabs, widths, themes, reload, the duo element opening and closing
const L = require('./lib.js');
(async () => {
  const browser = await L.launch();
  const pg = await L.newPage(browser, { viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const snap = async (lab) => {
    await L.settled(pg, 'bay');
    const duoOpen = await pg.evaluate(() => document.getElementById('duo').open);
    if (duoOpen) await L.settled(pg, 'duo-bay');
    await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const s = await pg.evaluate(() => { const h = document.getElementById('hero-glow'), c = document.querySelector('#duo-bay .glow'), t = document.querySelector('#bay .tile.shimmer'), dt = document.querySelector('#duo-bay .tile.shimmer');
      const act = document.querySelector('#tabs [aria-selected="true"], .tabs [aria-selected="true"]');
      return { tab: Array.from(document.querySelectorAll('[role=tab][aria-selected="true"]')).map((x) => x.id).join(','), hero: h.hidden ? 0 : +Number(h.dataset.strength).toFixed(4), heroVis: getComputedStyle(h).display !== 'none' && Number(getComputedStyle(h).opacity) > 0, tile: t ? t.querySelector('.v').textContent : null, col: c ? (c.hidden ? 0 : +Number(c.dataset.strength).toFixed(4)) : null, duoTile: dt ? dt.querySelector('.v').textContent : null, duoOpen: document.getElementById('duo').open }; });
    console.log(lab.padEnd(48), JSON.stringify(s));
    return s;
  };
  const tab = async (id) => { await pg.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; }); await pg.click('#tab-' + id); await pg.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 30000 }); };
  const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
  await L.load(pg, { action: 'stomp', logKg: 9, duoAction: 'collide', colSrc: 'set', colGB: gb01 }, 'allout');
  await snap('1 stomp 1e9 all-out');
  await tab('walk'); await snap('2 -> Walk');
  await tab('stomp'); await snap('3 -> Stomp again');
  await tab('lift'); await snap('4 -> Lift');
  await tab('weight'); await snap('5 -> Weight (no what-if)');
  await pg.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; }); await pg.click('#grow-what-chicxulub'); await pg.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old));
  await snap('6 Weight: dinosaur-killer what-if');
  await tab('throw'); await snap('7 -> Throw');
  await tab('weight'); await snap('8 -> Weight again');
  await pg.click('#duo > summary'); await pg.waitForTimeout(300); await snap('9 open Rex + Ollie (Collide, 0.1% c)');
  await L.setEffort(pg, 'duo-bay', 'allout'); await snap('10 duo all-out');
  await tab('walk'); await snap('11 solo -> Walk (duo open)');
  await pg.click('#duo > summary'); await pg.waitForTimeout(300); await snap('12 close Rex + Ollie');
  await pg.click('#duo > summary'); await pg.waitForTimeout(300); await snap('13 reopen');
  await pg.click('#tab-arm'); await pg.waitForTimeout(800); await snap('14 duo -> Arm');
  await pg.click('#tab-collide'); await pg.waitForTimeout(800); await snap('15 duo -> Collide');
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(800); await snap('16 width 390');
  await pg.emulateMedia({ colorScheme: 'dark' }); await snap('17 dark');
  await tab('stomp'); await snap('18 solo -> Stomp at 390');
  await pg.reload(); await snap('19 reload (saved page)');
  await pg.setViewportSize({ width: 1280, height: 900 }); await pg.waitForTimeout(800); await snap('20 width 1280');
  // the dial: lower strength under the floor
  await pg.evaluate(() => { const d = document.getElementById('dial') || document.querySelector('input[type=range]'); return d && d.id; }).then((id) => console.log('dial id', id));
  console.log('errors', pg.errs);
  await browser.close();
})();
