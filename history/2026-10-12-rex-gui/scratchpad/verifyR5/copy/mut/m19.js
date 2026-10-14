global.window = {};
const path = require('path');
const load = (dir) => { const f = path.join(dir, 'src/engine.js'); delete require.cache[require.resolve(f)]; const P = require(f); require(path.join(dir, 'src/data.js')); return P; };
for (const [lab, dir] of [['base', path.join(__dirname, '../lab')], ['M19', path.join(__dirname, 'm/M19-relcatch-sheath-off')]]) {
  const P = load(dir), D = window.DINO_DATA, g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id);
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
  const c = { F: 1e14 * g, mode: 'comic', body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true };
  const L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard');
  const k = L.catch;
  console.log(lab, L.result, 'vL', L.aim && L.aim.vL, 'vArrive', L.vArrive, 'sheath share', L.sheath && L.sheath.share, 'Earr', L.sheath && L.sheath.Earr, 'mLump', L.sheath && L.sheath.mLump, 'Ecatch', k && k.Ecatch, 'relativistic', k && k.relativistic, 'keys', k && Object.keys(k).join(','));
}
