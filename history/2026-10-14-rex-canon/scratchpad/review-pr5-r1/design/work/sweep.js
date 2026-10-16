const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const STATES = [
  ['walk stamp 1e9', { action: 'walk', logKg: 9, stepEffort: 1 }],
  ['walk stamp 1e6 sand', { action: 'walk', logKg: 6, stepEffort: 1, surface: 'sand' }],
  ['lift 1e9', { action: 'lift', logKg: 9 }, 'allout'],
  ['sprint 1e9', { action: 'sprint', logKg: 9 }, 'allout'],
  ['pull 1e9', { action: 'pull', logKg: 9 }, 'allout'],
  ['jump 1e9 allout', { action: 'jump', logKg: 9 }, 'allout'],
  ['jump allout soft', { action: 'jump', softLanding: true }, 'allout'],
  ['jump least soft', { action: 'jump', softLanding: true }],
  ['stomp least', { action: 'stomp' }],
  ['stomp 1e9 least', { action: 'stomp', logKg: 9 }],
  ['punch 1e9 silent least', { action: 'punch', logKg: 9, silentStrike: true }],
  ['throw person 30m', { action: 'throw', obj: 'person' }],
  ['arm 1e9', DUO({ duoAction: 'arm', logKg: 9 }), 'allout'],
  ['wrestle push 1e9', DUO({ duoAction: 'wrestle', wrestleMove: 'push', logKg: 9 }), 'allout'],
  ['wrestle shove 1e9', DUO({ duoAction: 'wrestle', wrestleMove: 'shove', logKg: 9 }), 'allout'],
  ['wrestle lift 1e9', DUO({ duoAction: 'wrestle', wrestleMove: 'lift', logKg: 9 }), 'allout'],
  ['wrestle throw ollie throws', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'ollie', logKg: 9 }), 'allout'],
  ['wrestle throw both', DUO({ duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'both', logKg: 9 }), 'allout'],
  ['collide push', DUO({ duoAction: 'collide', colMode: 'push' }), 'allout'],
  ['collide rex charges', DUO({ duoAction: 'collide', colWho: 'rex' }), 'allout'],
  ['collide bounce', DUO({ duoAction: 'collide', colBounce: 'bounce' }), 'allout'],
  ['collide stomp src 1e9', DUO({ duoAction: 'collide', colSrc: 'stomp', logKg: 9 }), 'allout'],
  ['collide inf', DUO({ duoAction: 'collide', colInf: true }), 'allout'],
  ['catch person hard 1e4m', DUO({ duoAction: 'catch', cObj: 'person', cStyle: 'hard', cLogD: 4 }), 'allout'],
  ['catch miss car', DUO({ duoAction: 'catch', cObj: 'car', cMiss: true }), 'allout'],
  ['catch baseball least', DUO({ duoAction: 'catch', cObj: 'baseball' })],
];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto(url);
  for (const [nm, st, eff] of STATES) {
    try { await loadOn(pg, st, eff); } catch (e) { console.log(nm, 'LOAD FAIL', e.message); continue; }
    const bay = st.duoOpen ? 'duo-bay' : 'bay';
    const r = await pg.evaluate((b) => {
      const box = document.getElementById(b), t = box.querySelector('.tile.shimmer');
      const txt = box.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ');
      const sents = txt.split(/(?<=[.)])\s+(?=[A-Z])/).filter((s) => /taken back|takes? (it|its energy|that) back|endless ocean|Shimmer|absorbed/i.test(s) && !(t && t.textContent.replace(/ /g, ' ').includes(s)));
      const hero = document.getElementById('hero-glow'), col = document.querySelector('#duo-bay .glow');
      return { tile: t ? t.textContent.replace(/ /g, ' ') : null, last: t ? t.parentElement.lastElementChild === t : null, sents: sents.map((s) => s.slice(0, 260)), hero: hero.hidden ? 0 : +hero.dataset.strength, col: col ? (col.hidden ? 0 : +col.dataset.strength) : null };
    }, bay);
    console.log('\n## ' + nm + ' | tile: ' + (r.tile ? r.tile.slice(0, 230) : 'NONE') + ' | last ' + r.last + ' | hero ' + r.hero.toFixed(3) + ' col ' + r.col);
    for (const s of r.sents.slice(0, 8)) console.log('   - ' + s);
  }
  console.log('errs', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
