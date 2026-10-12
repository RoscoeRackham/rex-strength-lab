const { launch } = require('./lib.js');
const { pathToFileURL } = require('url');
const PREV = '/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html';
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(PREV).href);
  const states = [];
  for (const mode of ['comic', 'real']) for (const lk of [5, 12, 20, 'inf']) {
    const base = Object.assign({ group: 'duo', mode }, lk === 'inf' ? { inf: true } : { logKg: lk });
    states.push(Object.assign({}, base, { duoAction: 'arm' }));
    for (const wm of ['push', 'shove', 'lift', 'throw']) states.push(Object.assign({}, base, { duoAction: 'wrestle', wrestleMove: wm }));
    for (const [o, d, s] of [['baseball', 1, 'easy'], ['baseball', 3, 'hard'], ['car', 2, 'hard'], ['car', 3, 'hard'], ['person', 1.5, 'hard'], ['piano', 2, 'easy'], ['bus', 4, 'hard']]) states.push(Object.assign({}, base, { duoAction: 'catch', cObj: o, cLogD: d, cStyle: s }));
    for (const src of ['sprint', 'jump', 'stomp']) states.push(Object.assign({}, base, { duoAction: 'collide', colSrc: src }));
  }
  let bad = 0;
  for (const st of states) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload();
    let t = '';
    for (let i = 0; i < 100; i++) { await page.waitForTimeout(300); t = await page.evaluate(() => document.querySelector('#bay').innerText); if (!/working it out/i.test(t)) break; }
    const claimsSafe = /no cap needed|nothing around them breaks|Nothing in this test harms anything nearby/.test(t);
    const m = t.match(/At this effort ([^\n]*)/);
    if (claimsSafe && m) { bad++; console.log('CONTRADICTION', JSON.stringify(st), '|', (t.match(/(All-out: no cap needed\.|Effort: [^\n]*)/) || [''])[0].slice(0, 90), '| At this effort', m[1]); }
  }
  console.log('states', states.length, 'contradictions', bad, 'errors', errs.slice(0, 3));
  await b.close();
})();
