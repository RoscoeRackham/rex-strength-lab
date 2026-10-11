const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA, g = P.K.g, deg = Math.PI / 180;
const sand = D.surfaces.find(s => s.id === 'sand');
const gam = sand.rho * g;
const Nq = (p) => Math.exp(Math.PI * Math.tan(p * deg)) * Math.tan((45 + p / 2) * deg) ** 2;
const Ng = (p) => 2 * (Nq(p) + 1) * Math.tan(p * deg);
for (const H of [2, 50]) {
  const body = P.makeBody({ H, m: 180 * (H / 2) ** 3 });
  const B = Math.sqrt(body.footArea);
  const qS = 0.5 * gam * B * Ng(30) * 0.6;
  const qAvgStroke = qS + gam * Nq(30) * (1 + Math.tan(30 * deg)) * body.strokes.leg / 2; // mean over stroke depth
  for (const [lbl, kg] of [['human', 511], ['spidey', 10 * 907.18474], ['thing', 100 * 907.18474]]) {
    const row = [];
    for (const q of [sand.qult, qS, qAvgStroke]) {
      const j = P.jump({ F: kg * g, mode: 'comic', body, surface: { ...sand, qult: q }, groundHolds: false, anchor: 'friction' });
      row.push(j.flight.apex.toFixed(2) + (j.groundFails ? '(gf)' : ''));
    }
    console.log('H', H, lbl, 'apex m: engine150kPa / VesicSurface / VesicMeanOverStroke =', row.join(' / '), '| q kPa', (qS / 1e3).toFixed(0), (qAvgStroke / 1e3).toFixed(0));
  }
}
