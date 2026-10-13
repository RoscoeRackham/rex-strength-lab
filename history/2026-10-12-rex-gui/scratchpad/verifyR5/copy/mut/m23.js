global.window = {};
const path = require('path');
const load = (dir) => { const f = path.join(dir, 'src/engine.js'); delete require.cache[require.resolve(f)]; const P = require(f); require(path.join(dir, 'src/data.js')); return P; };
for (const [lab, dir] of [['base', path.join(__dirname, '../lab')], ['M23', path.join(__dirname, 'm/M23-fastAirWithin-nocolumn')]]) {
  const P = load(dir), D = window.DINO_DATA, g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id);
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), conc = D.surfaces.find((s) => s.id === 'concrete');
  for (const [id, ang] of [['car', 0], ['car', 90], ['pyramid', 90], ['baseball', 90]]) for (const sh of [0, 0.9]) {
    const c = { F: 1e15 * g, mode: 'comic', body: rex, surface: conc, anchor: 'friction', airAbsorb: sh, keepForm: true, unbreakable: true, ownRecoil: true };
    const lg = id === 'pyramid' ? 1e22 : 1e15; c.F = lg * g;
    const r = P.throwObject(c, obj(id), ang);
    const rc = P.RESTRAINT.reach('throw', r, Object.assign({ obj: obj(id), angle: ang, surface: conc, body: rex, near: 5 }, c));
    console.log(lab, id, ang, sh, 'rel', r.flight.relativistic, 'air reach km', (rc.air / 1000).toPrecision(4), 'houses', (rc.houses / 1000).toPrecision(4));
  }
}
