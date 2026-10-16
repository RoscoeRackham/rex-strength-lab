const h = require('./h.js'); const { P, TB } = h;
const PART = ['drag', 'footing', 'soft', 'silent', 'hit', 'stop', 'passenger', 'catch', 'growth'];
const KEYS = ['airAbsorb', 'keepForm', 'unbreakable', 'ownRecoil', 'safePassenger', 'silentStrike', 'softLanding', 'noKnockback'];
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const nums = (tb) => [tb.E, tb.by.rex.E, tb.by.ollie.E].concat(PART.map((k) => tb.parts[k]), PART.map((k) => tb.by.rex.parts[k]), PART.map((k) => tb.by.ollie.parts[k]));
const bad = []; let n = 0, nOff = 0; const t0 = Date.now();
const dials = [1e3, 100 * 907.18474, 1e6, 1e9, 1e12, 1e16, Infinity];
for (let it = 0; it < 1400; it++) {
  const allOff = it % 3 === 0;
  const pw = {}; for (const k of KEYS) pw[k] = allOff ? (k === 'airAbsorb' ? 0 : false) : (k === 'airAbsorb' ? [0, 0.5, 1][Math.floor(rnd() * 3)] : rnd() < 0.5);
  const kg = dials[Math.floor(rnd() * dials.length)], F = kg * h.g;
  const sid = ['concrete', 'sand', 'granite', 'clay'][Math.floor(rnd() * 4)];
  const anchor = rnd() < 0.2 ? 'bolted' : 'friction';
  const c = h.ctx(F, h.R3, Object.assign({ surface: h.surf(sid) || h.surf('concrete'), anchor }, pw)), co = h.ctx(F, h.O3, Object.assign({ surface: h.surf(sid) || h.surf('concrete'), anchor: rnd() < 0.2 ? 'bolted' : 'friction' }, pw));
  const mv = ['throw', 'jump', 'stomp', 'punch', 'clap', 'wrestleThrow', 'catch', 'toss', 'collide'][Math.floor(rnd() * 9)];
  let tb, lab = mv + ' ' + kg + ' ' + JSON.stringify(pw) + ' ' + sid;
  try {
    if (mv === 'throw') { const ob = h.D.objects.filter((o) => !o.noThrow)[Math.floor(rnd() * 20)]; const th = [0, 45, 90][Math.floor(rnd() * 3)]; tb = TB('throw', P.throwObject(c, ob, th), Object.assign({}, c, { obj: ob, angle: th })); lab += ' ' + ob.id; }
    else if (mv === 'jump') tb = TB('jump', P.jump(c), c);
    else if (mv === 'stomp') tb = TB('stomp', P.stomp(c), c);
    else if (mv === 'punch') tb = TB('punch', P.punch(c), c);
    else if (mv === 'clap') tb = TB('clap', P.clap(c), c);
    else if (mv === 'wrestleThrow') { const th = [20, 45, 90][Math.floor(rnd() * 3)]; tb = TB('wrestleThrow', P.throwPartner(c, co, th), { A: c, B: co, whoA: 'rex', angle: th }); }
    else if (mv === 'catch') { const ob = h.obj(['baseball', 'car', 'person', 'bowling'][Math.floor(rnd() * 4)]); const D0 = [10, 100, 3e4][Math.floor(rnd() * 3)], st = rnd() < 0.5 ? 'easy' : 'hard'; const a = P.catchLeg(c, co, ob, D0, st), b = P.catchLeg(co, c, ob, D0, st); tb = TB('catch', { a, b }, { A: c, B: co, whoA: 'rex', obj: ob }); lab += ' ' + ob.id + ' ' + D0 + ' ' + st + ' ' + a.result; }
    else if (mv === 'toss') { const st = rnd() < 0.5 ? 'easy' : 'hard'; tb = TB('toss', P.tossPartner(c, h.O3, 'Ollie', st, [10, 1000, 1e5][Math.floor(rnd() * 3)], co.anchor), { A: c, B: co, whoA: 'rex' }); }
    else { const src = ['sprint', 'set', 'jump', 'stomp'][Math.floor(rnd() * 4)]; const o = { source: src, gb: [1e-6, 1e-3, 1, 1e4, Infinity][Math.floor(rnd() * 5)], bounce: rnd() < 0.3, meanIt: rnd() < 0.2 }; const B2 = rnd() < 0.1 ? Object.assign({}, c, { immovable: true }) : c; tb = TB('collide', P.collide(co, B2, o), { A: co, B: B2, whoA: 'ollie' }); lab += ' ' + JSON.stringify(o); }
  } catch (e) { bad.push(['threw', lab, e.message]); continue; }
  n++;
  const ns = nums(tb);
  if (ns.some((x) => typeof x !== 'number' || Number.isNaN(x) || x < 0)) bad.push(['nan/neg', lab]);
  if (tb.unbounded !== (tb.E === Infinity)) bad.push(['unbounded flag', lab]);
  if (allOff) { nOff++; if (ns.some((x) => x !== 0)) bad.push(['off nonzero', lab, JSON.stringify(tb.parts)]); }
}
console.log('runs', n, 'all-off', nOff, 'bad', bad.length, (Date.now() - t0) / 1000 + ' s'); for (const b of bad.slice(0, 10)) console.log(b.join(' | ').slice(0, 400));
