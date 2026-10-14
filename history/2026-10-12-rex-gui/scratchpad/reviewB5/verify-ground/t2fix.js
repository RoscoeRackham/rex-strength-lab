global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('./engine-fix2.js'), D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['sand', 'gravel', 'softclay', 'concrete']) {
  const s = D.surfaces.find(x => x.id === sid);
  let prev = null, drops = 0, line = [];
  for (let lg = -1; lg <= 7; lg += 0.01) {
    const t = Math.pow(10, lg);
    const c = { F: t * 1000 * P.K.g, mode: 'comic', body: rex, surface: s, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = P.stomp(c), o = { body: rex, surface: s, unbreakable: true };
    const b = M.blow(r, o); if (!b) continue;
    const ppv = P.ppvAt(M.shake(r, o), 5) * 1000;
    if (prev && ppv < prev * 0.98) drops++;
    prev = ppv;
    if ([0, 100, 200, 300, 500, 800].includes(Math.round((lg + 1) * 100))) line.push(t.toPrecision(2) + 't:' + ppv.toFixed(2));
  }
  console.log(sid, 'drops', drops, line.join(' '));
}
