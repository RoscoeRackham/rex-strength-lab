// Lens items 2-3: every move over a wide sweep; with every power off E is exactly 0; each power alone gives only its own
// parts; with all on no NaN/negative, unbounded iff Infinity; and each part equals the engine's own figure under its rule.
const H = require('./h.js')(process.argv[2]);
const { P, D, g, obj, R3, O3, c9, TB, sig, OFF } = H;
const PART = ['drag', 'footing', 'soft', 'silent', 'hit', 'stop', 'passenger', 'catch', 'growth'];
const ALL = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true, silentStrike: true, softLanding: true };
const OWN = { airAbsorb: ['drag'], unbreakable: ['footing'], softLanding: ['soft'], silentStrike: ['silent'], ownRecoil: ['hit', 'stop', 'catch'], noKnockback: ['hit'], safePassenger: ['passenger'], keepForm: [] };
const nums = (tb) => [tb.E, tb.by.rex.E, tb.by.ollie.E].concat(PART.map((k) => tb.parts[k]), PART.map((k) => tb.by.rex.parts[k]), PART.map((k) => tb.by.ollie.parts[k]));
const clean = (tb) => nums(tb).every((x) => typeof x === 'number' && !Number.isNaN(x) && x >= 0) && tb.unbounded === (tb.E === Infinity) && tb.by.rex.unbounded === (tb.by.rex.E === Infinity) && tb.by.ollie.unbounded === (tb.by.ollie.E === Infinity)
  && PART.every((k) => tb.parts[k] === tb.by.rex.parts[k] + tb.by.ollie.parts[k]) && tb.E === tb.by.rex.E + tb.by.ollie.E;
const dials = [1e2, 1e4, 100 * 907.18474, 1e7, 1e9, 1e11, 1e13, 1e15, 1e17, 1e19, Infinity];
function runs(pw, surfId) {
  const out = [];
  const sf = H.surf(surfId);
  for (const kg of dials) {
    const F = kg * g, x = Object.assign({ surface: sf }, pw), c = c9(F, R3, x), co = c9(F, O3, x);
    const tag = (s) => s + ' @' + (isFinite(kg) ? sig(kg, 2) : 'inf') + ' ' + surfId;
    for (const id of ['baseball', 'car', 'person', 'esb']) for (const th of [0, 45, 90]) { const r = P.throwObject(c, obj(id), th); out.push([tag('throw ' + id + ' ' + th), TB('throw', r, Object.assign({}, c, { obj: obj(id), angle: th }))]); }
    out.push([tag('jump'), TB('jump', P.jump(c), c)], [tag('stomp'), TB('stomp', P.stomp(c), c)], [tag('punch'), TB('punch', P.punch(c), c)], [tag('clap'), TB('clap', P.clap(c), c)]);
    for (const th of [20, 45, 90]) out.push([tag('wrestle ' + th), TB('wrestleThrow', P.throwPartner(c, co, th), { A: c, B: co, whoA: 'rex', angle: th })]);
    for (const [id, D0, st] of [['baseball', 10, 'hard'], ['baseball', 1e3, 'easy'], ['car', 30, 'easy'], ['car', 1e4, 'hard'], ['person', 10, 'easy'], ['person', 31.6e3, 'hard']]) {
      for (const kf of [true, false]) {
        const cR = Object.assign({}, c, { keepForm: pw.keepForm && kf }), cO = Object.assign({}, co, { keepForm: pw.keepForm && kf });
        let a, b; try { a = P.catchLeg(cR, cO, obj(id), D0, st); b = P.catchLeg(cO, cR, obj(id), D0, st); } catch (e) { out.push([tag('catch threw ' + id), null]); continue; }
        out.push([tag('catch ' + id + ' ' + D0 + ' ' + st + (kf ? '' : ' kf-off')), TB('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: obj(id) })]);
        out.push([tag('catch-miss ' + id + ' ' + D0 + ' ' + st + (kf ? '' : ' kf-off')), TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: obj(id), miss: true })]);
      }
    }
    for (const st of ['easy', 'hard']) for (const h of [10, 1000]) out.push([tag('toss ' + st + ' ' + h), TB('toss', P.tossPartner(c, O3, 'Ollie', st, h, 'friction'), { A: c, B: co, whoA: 'rex' })]);
    for (const o of [{ source: 'sprint' }, { source: 'jump' }, { source: 'set', gb: 1e-3 }, { source: 'set', gb: 1 }, { source: 'set', gb: Infinity }, { source: 'set', gb: 1e-3, bounce: true }, { source: 'set', gb: 1e-3, meanIt: true }]) {
      let r; try { r = P.collide(co, c, o); } catch (e) { out.push([tag('collide threw'), null]); continue; }
      out.push([tag('collide ' + JSON.stringify(o)), TB('collide', r, { A: co, B: c, whoA: 'ollie' })]);
    }
  }
  return out;
}
const res = {};
for (const sid of ['concrete', 'sand']) {
  const off = runs(OFF, sid), badOff = off.filter(([, tb]) => !tb || tb.E !== 0 || nums(tb).some((x) => x !== 0)).map(([l, tb]) => l + (tb ? ' E=' + tb.E : ' threw'));
  console.log(sid, 'every power off:', off.length, 'runs;', badOff.length, 'with something taken back', badOff.slice(0, 5).join(' | '));
  const all = runs(ALL, sid), badAll = all.filter(([, tb]) => !tb || !clean(tb)).map(([l, tb]) => l + (tb ? ' ' + JSON.stringify(tb.parts) : ' threw'));
  console.log(sid, 'every power on:', all.length, 'runs;', badAll.length, 'unclean', badAll.slice(0, 5).join(' | '), '; unbounded:', all.filter(([, tb]) => tb && tb.unbounded).length, '; >0:', all.filter(([, tb]) => tb && tb.E > 0).length);
  const bad = [], seen = {};
  for (const [pw, parts] of Object.entries(OWN)) {
    const one = Object.assign({}, OFF, { [pw]: pw === 'airAbsorb' ? 1 : true });
    for (const [l, tb] of runs(one, sid)) { if (!tb) continue; for (const k of PART) if (tb.parts[k] > 0) { if (!parts.includes(k)) bad.push(pw + ' alone: ' + l + ' ' + k + '=' + sig(tb.parts[k])); else seen[pw + ':' + k] = true; } }
  }
  console.log(sid, 'each power alone gives only its parts:', bad.length, 'violations', bad.slice(0, 6).join(' | '), '; seen', Object.keys(seen).join(','));
}
