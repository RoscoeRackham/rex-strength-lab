// landing-only (and whole-jump) shaking vs effort, powers on; reports first drop per surface
const dir = process.argv[2], build = process.argv[3] || 'rex';
global.window = {};
const P = require(dir + '/engine.js'); require(dir + '/data.js');
const D = window.DINO_DATA, M = P.RESTRAINT.MOVES.jump;
const body = P.makeBody({ build, H: build === 'rex' ? 3.048 : 3.06, m: 3007 });
for (const sf of D.surfaces) {
  if (!P.groundOf(sf)) continue;
  let prevL = 0, prevLR = 0, prevW = 0, dropL = null, dropLR = null, dropW = null;
  for (let lg = 1.5; lg <= 12.4; lg += 0.02) {
    const on = { mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = P.jump(Object.assign({ F: Math.pow(10, lg) * P.K.g }, on));
    if (!r.landing || !r.landing.landed) continue;
    const all = M.shake(r, Object.assign({ near: 5, m: body.m, body, surface: sf }, on)).filter(Boolean);
    const land = all.slice(0, 2);
    const vL = P.ppvAt(land, 5), vLR = P.plasterReach(land), vW = P.ppvAt(all, 5);
    if (!dropL && vL < prevL * (1 - 1e-6)) dropL = lg.toFixed(2) + ' ' + (prevL*1e3).toFixed(3) + '->' + (vL*1e3).toFixed(3);
    if (!dropLR && vLR < prevLR * (1 - 1e-6)) dropLR = lg.toFixed(2) + ' ' + prevLR.toFixed(2) + '->' + vLR.toFixed(2);
    if (!dropW && vW < prevW * (1 - 1e-6)) dropW = lg.toFixed(2) + ' ' + (prevW*1e3).toFixed(3) + '->' + (vW*1e3).toFixed(3);
    prevL = Math.max(prevL, vL); prevLR = Math.max(prevLR, vLR); prevW = Math.max(prevW, vW);
  }
  console.log(build, sf.id.padEnd(10), 'landing ppv5 drop:', dropL, '| landing plaster reach drop:', dropLR, '| whole ppv5 drop:', dropW, '| max landing ppv5', (prevL*1e3).toFixed(2), 'max landing plR', prevLR.toFixed(2));
}
