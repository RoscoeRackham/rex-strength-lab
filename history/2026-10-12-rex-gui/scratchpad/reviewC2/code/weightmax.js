global.window = {};
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const P = require(R0+'src/engine.js');
const L = require(R0+'src/ladder.js');
const surf = D.surfaces.find(s => s.id === 'concrete');
for (const H of [3.048, 500]) {
  let maxE = 0, maxNm = 0, at = null, atNm = null;
  for (let e = 3; e <= 32; e += 0.02) {
    const m = Math.pow(10, e);
    const body = P.makeBody({ build: 'rex', H, m });
    const c = { F: 1e5 * 9.8, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    let r; try { r = P.weight(c); } catch (err) { continue; }
    const pl = r.planet;
    const E = pl.regime === 'blackHole' ? 0 : pl.regime !== 'none' ? pl.eLow : r.energyJ;
    if (E > maxE) { maxE = E; at = m; }
    if (r.nmCaveat && pl.regime !== 'blackHole' && r.nmCaveat.J > maxNm) { maxNm = r.nmCaveat.J; atNm = m; }
  }
  console.log('H', H, 'max Energy-released tile', maxE.toExponential(2), 'at m', at && at.toExponential(2), '|', L.compare(maxE, D.energyRefs).text);
  console.log('      max dense-matter energy (nmText)', maxNm.toExponential(2), 'at m', atNm && atNm.toExponential(2), '|', L.compare(maxNm, D.energyRefs).text);
}
