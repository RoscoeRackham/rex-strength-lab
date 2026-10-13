const H = require('./h.js');
const SPECS = [
  { tab: 'throw', state: { obj: 'baseball', logKg: 23.2587, angle: 0, airAbsorb: 0.5 }, effort: 'allout' },
  { tab: 'throw', state: { obj: 'baseball', logKg: 7, airAbsorb: 0.5 }, effort: 'allout' },
  { tab: 'throw', state: { obj: 'baseball', logKg: 9, angle: 0 }, effort: 'windows' },
  { tab: 'stomp', state: { logKg: 25 }, effort: 'allout' },
  { tab: 'pull', state: { obj: 'bus', logKg: 7 }, effort: 'allout' },
  { tab: 'lift', state: { obj: 'tank', surface: 'sand' } },
  { tab: 'weight', state: { m: 3.007e9, surface: 'granite' } },
  { tab: 'collide', duo: true, state: { anchor: 'bolted' }, effort: 'plaster' },
  { tab: 'catch', duo: true, state: { cObj: 'baseball', cStyle: 'hard', logKg: 20 }, effort: 'allout' },
  { tab: 'wrestle', duo: true, state: { wrestleMove: 'shove', logKg: 8 }, effort: 'allout' },
  { tab: 'arm', duo: true, state: { unbreakable: false }, effort: 'rattle' },
];
(async () => {
  for (const scheme of ['light', 'dark']) for (const s of SPECS) {
    const p = await H.open({ w: 390, h: 844, scheme, state: s.state });
    await H.tab(p, s.tab, s.duo);
    if (s.effort) await H.setEffort(p, s.effort, s.duo);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const wide = await p.evaluate(() => Array.from(document.querySelectorAll('.status, .chip, .tile')).filter((n) => n.getBoundingClientRect().right > window.innerWidth + 1).map((n) => n.textContent.slice(0, 60)));
    const bad = await p.evaluate(() => (document.body.innerText.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []));
    console.log(scheme, s.tab, JSON.stringify(s.state), 'overflow', ov, wide.length ? wide : '', bad.length ? bad : '', p.errs.length ? p.errs : '');
    if (scheme === 'light' && (s.tab === 'throw' || s.tab === 'collide')) await p.screenshot({ path: `out/${s.tab}-${s.effort}-390.png`, fullPage: false });
    await p.close();
  }
  await H.close();
})();
