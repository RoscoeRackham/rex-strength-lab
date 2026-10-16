// the Shimmer tile: place, presence (powers on / every relevant power off), a11y tree, contrast
const L = require('./lib.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
const D = (x) => Object.assign({ duoOpen: true, action: 'walk' }, x);
const RUNS = [
  ['throw', { action: 'throw', obj: 'car' }, 'allout', 1],
  ['throw-person', { action: 'throw', obj: 'person' }, null, 1],
  ['jump-soft', { action: 'jump', softLanding: true }, 'allout', 1],
  ['stomp', { action: 'stomp' }, 'allout', 1],
  ['punch9', { action: 'punch', logKg: 9, silentStrike: true }, 'allout', 1],
  ['clap9', { action: 'clap', logKg: 9, silentStrike: true }, 'allout', 1],
  ['walk', { action: 'walk' }, null, 0], ['lift', { action: 'lift' }, 'allout', 0], ['sprint', { action: 'sprint' }, 'allout', 0], ['pull', { action: 'pull' }, 'allout', 0],
  ['wrestle-throw', D({ duoAction: 'wrestle', wrestleMove: 'throw' }), 'allout', 1],
  ['wrestle-throw9', D({ duoAction: 'wrestle', wrestleMove: 'throw', logKg: 9 }), 'allout', 1],
  ['catch-car', D({ duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: 1 }), 'allout', 1],
  ['catch-fastball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1 }), 'allout', 1],
  ['catch-fireball', D({ duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0.5 }), 'allout', 1],
  ['toss', D({ duoAction: 'catch', cObj: 'partner', cStyle: 'easy', cLogD: 1 }), 'allout', 1],
  ['collide', D({ duoAction: 'collide' }), 'allout', 1],
  ['collide-rex', D({ duoAction: 'collide', colWho: 'rex' }), 'allout', 1],
  ['arm', D({ duoAction: 'arm' }), 'allout', 0], ['wrestle-push', D({ duoAction: 'wrestle', wrestleMove: 'push' }), 'allout', 0], ['collide-push', D({ duoAction: 'collide', colMode: 'push' }), 'allout', 0],
];
(async () => {
  const browser = await L.launch();
  const width = Number(process.argv[2] || 1280);
  const pg = await L.newPage(browser, { viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const probs = [];
  for (const off of [false, true]) for (const [nm, st0, eff, want] of RUNS) {
    const st = off ? Object.assign({}, st0, OFF) : st0;
    if (off && nm === 'catch-fireball') continue; if (process.argv[3] && !nm.startsWith(process.argv[3])) continue;
    await L.load(pg, st, eff);
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    const t = await L.tileOf(pg, bay);
    const info = await pg.evaluate((b) => { const rows = Array.from(document.querySelectorAll('#' + b + ' .tiles')); return { rows: rows.map((r) => Array.from(r.children).map((c) => (c.classList.contains('shimmer') ? '[S]' : ((c.querySelector('.k') || {}).textContent || '?').slice(0, 22)))), n: document.querySelectorAll('#' + b + ' .tile.shimmer').length }; }, bay);
    const hg = await L.glowOf(pg, '#hero-glow'), cg = st.duoAction === 'collide' ? await L.glowOf(pg, '#duo-bay .glow') : null;
    const expect = off ? 0 : want;
    const has = !!t;
    const line = (off ? 'OFF ' : 'on  ') + nm.padEnd(16) + ' tile ' + (has ? 'yes' : 'no ') + (has ? ' last ' + t.last + ' v "' + t.v + '"' : '') + ' rows ' + JSON.stringify(info.rows) + ' hero ' + (hg.hidden ? 0 : Number(hg.strength).toFixed(3)) + (cg ? ' col ' + (cg.hidden ? 0 : Number(cg.strength).toFixed(3)) : '');
    console.log(line);
    if (has !== !!expect || (has && !t.last) || info.n > 1) probs.push(line);
    if (off && !st.duoOpen && !hg.hidden) probs.push('glow with powers off: ' + line);
  }
  console.log('PROBLEMS', probs.length); probs.forEach((p) => console.log('  ' + p));
  console.log(pg.errs.slice(0, 5));
  await browser.close();
})();
