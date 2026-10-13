global.window = {};
const path = require('path');
const load = (dir) => { const f = path.join(dir, 'src/engine.js'); delete require.cache[require.resolve(f)]; const P = require(f); require(path.join(dir, 'src/data.js')); return P; };
const base = path.join(__dirname, '../lab');
const which = process.argv[2];
const P0 = load(base), D = window.DINO_DATA, P1 = load(path.join(__dirname, 'm', which));
const g = P0.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const mk = (P) => ({ rex: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (P, F, o) => Object.assign({ F, mode: 'comic', body: mk(P).rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, o || {});
const J = (x) => JSON.stringify(x, (k, v) => typeof v === 'number' && !isFinite(v) ? String(v) : v);
const tests = {
  'M6-shoveB-longT': (P) => { const out = []; for (const lg of [3, 4, 5, 6, 8, 10]) { const cR = ctxOf(P, Math.pow(10, lg) * g, { unbreakable: true }), cO = Object.assign({}, cR, { body: mk(P).ollie, anchor: 'bolted' }); const s = P.shove(cR, cO); out.push(lg + ':' + (s.toGroundB ? s.toGroundB.J.toPrecision(4) + '/T' + s.toGroundB.T.toPrecision(3) + '/pt' + s.push.t.toPrecision(3) : 'none')); } return out.join(' '); },
  'M8-collide-inf-uncapped': (P) => { const out = []; for (const sf of ['sand', 'gravel', 'concrete']) for (const src of ['jump', 'stomp', 'sprint']) for (const F of [1e6 * g, 1e12 * g, Infinity]) { const cA = Object.assign(ctxOf(P, F, Object.assign({}, ON, { surface: surf(sf) })), { body: mk(P).ollie }), cB = ctxOf(P, F, Object.assign({}, ON, { surface: surf(sf) })); try { const r = P.collide(cA, cB, { source: src }); out.push(sf + '/' + src + '/' + F.toPrecision(2) + ':' + (r.toGround ? J({ J: r.toGround.J, s: r.toGround.supplied, why: r.hold && r.hold.why }) : r.outcome)); } catch (e) { out.push('ERR ' + e.message); } } return out.join('\n'); },
  'M11-stomp-hard-dent0': (P) => { const out = []; const M = P.RESTRAINT.MOVES; for (const sf of ['concrete', 'asphalt', 'granite', 'ice', 'stiffclay']) for (let lg = 1; lg <= 12; lg += 0.25) { const c = ctxOf(P, Math.pow(10, lg) * g, Object.assign({}, ON, { surface: surf(sf) })), r = P.stomp(c), b = M.stomp.blow(r, Object.assign({ surface: c.surface, body: c.body }, ON)); out.push(sf + ' ' + lg + ' ' + (b ? b.J.toPrecision(5) : 'null')); } return out.join('\n'); },
  'M19-relcatch-sheath-off': (P) => { const out = []; for (const lg of [10, 12, 13, 14, 15, 16, 17]) for (const D_ of [60, 200, 1000]) { const c = ctxOf(P, Math.pow(10, lg) * g, Object.assign({}, ON, { airAbsorb: 0.5 })); const L = P.catchLeg(c, Object.assign({}, c, { body: mk(P).ollie }), obj('baseball'), D_, 'hard'); out.push(lg + ' ' + D_ + ' ' + L.result + ' v ' + (L.vArrive || 0).toPrecision(4) + ' Ecatch ' + (L.catch && L.catch.Ecatch != null ? L.catch.Ecatch.toPrecision(5) : '-') + ' rel ' + !!(L.catch && L.catch.relativistic) + ' sheath ' + !!L.sheath); } return out.join('\n'); },
  'M26-fric-only-when-down': (P) => { const out = []; for (const a of [0, 5, 10, 20, 30]) for (const lg of [5, 6]) { const r = P.throwObject(ctxOf(P, Math.pow(10, lg) * g, Object.assign({}, ON, { ownRecoil: false })), obj('car'), a); out.push(a + ' ' + lg + ' ' + J(r.toGround)); } return out.join('\n'); },
};
const a = tests[which](P0), b = tests[which](P1);
const al = a.split(/\n| /), bl = b.split(/\n| /);
let diff = 0; const la = a.split('\n'), lb = b.split('\n');
for (let i = 0; i < Math.max(la.length, lb.length); i++) if (la[i] !== lb[i]) { diff++; if (diff <= 8) console.log('BASE ', la[i], '\nMUT  ', lb[i]); }
console.log(which, 'differing lines:', diff, 'of', la.length);
