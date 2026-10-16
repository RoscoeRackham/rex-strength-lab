// Q5 at 10^20 kg: the catcher held (as a proxy, Ollie bolted) vs carried off today: what is freed at the catch
global.window = {};
const root = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(root + '/src/engine.js');
require(root + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3000 });
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (b, x) => Object.assign({ F: 1e20 * g, mode: 'comic', body: b, surface: sf('concrete'), anchor: 'friction' }, POW, x || {});
for (const [lbl, oAnc] of [['today (friction)', 'friction'], ['held (bolted proxy)', 'bolted']]) {
  const L = P.catchLeg(c(rex), c(ollie, { anchor: oAnc }), ob('baseball'), 10, 'hard');
  const k = L.catch || {};
  console.log(lbl, L.result, 'carried', k.carried, 'uAfter', sig(k.uAfter), 'Ediss', sig(k.Ediss), 'Ecatch', sig(k.Ecatch), 'toGroundC', JSON.stringify(L.toGroundC && { J: sig(L.toGroundC.J), whole: sig(L.toGroundC.whole), supplied: sig(L.toGroundC.supplied) }));
}
