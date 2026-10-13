global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = 9.80665, surf = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const load = (f) => { delete require.cache[require.resolve(f)]; return require(f); };
const P0 = load('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'), PA = load(__dirname + '/mA-fireball-E.js'), PD = load(__dirname + '/mD-toss.js');
for (const lg of [14, 16, 18, 20, 22, 23]) for (const oid of ['baseball', 'car']) {
  const f = (P) => { const R = { F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }); const L = P.catchLeg(R, O, obj(oid), 30, 'hard'); return [L.result, L.fireball && L.fireball.E, L.fireball && L.fireball.Earr, L.fireball && L.fireball.kind]; };
  const a = f(P0), b = f(PA); if (JSON.stringify(a) !== JSON.stringify(b)) console.log('mA changes', lg, oid, JSON.stringify(a), '->', JSON.stringify(b));
}
for (let lg = 13; lg <= 16; lg += 0.25) {
  const f = (P) => { const R = { F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }; const r = P.tossPartner(R, P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), 'Ollie', 'hard', 10, 'friction'); return [r.result, r.v]; };
  const a = f(P0), b = f(PD); if (JSON.stringify(a) !== JSON.stringify(b)) { console.log('mD changes', lg, JSON.stringify(a), '->', JSON.stringify(b)); break; }
}
