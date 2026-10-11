// The face-limit shapes have their arms drawn at 92 degrees (rest angle 90 = cannot clear). How does
// the measuring tool count horizontal arms? Compare: tool on the full drawing; tool on the drawing
// without arms (head + body only) plus the arms' own volume (solid of revolution, both arms, the
// part outside the body outline); and the tool's warnings.
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const builds = require(B + '/build-calculator/data/builds.json');
const Fig = require(B + '/build-comparison/src/figure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const { measureViews } = require(B + '/build-comparison/tools/export_targets.js');
const calc = BC.create(builds);
const H = 1.8;
const rAt = (stn, s) => { if (s <= stn[0][0]) return stn[0][1]; for (let i = 1; i < stn.length; i++) if (s <= stn[i][0]) return stn[i - 1][1] + (stn[i][1] - stn[i - 1][1]) * (s - stn[i - 1][0]) / (stn[i][0] - stn[i - 1][0]); return stn[stn.length - 1][1]; };
function armVol(fig, deg) {
  const d = fig.dims, body = fig.front.find((p) => p.name === 'body').poly, st = d.armStations, sj = d.shoulderJoint;
  const a = deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = st.Lu + st.Lf, ds = L / 2000; let v = 0;
  for (let s = ds / 2; s < L; s += ds) {
    const p = [sj[0] + dx * s, sj[1] + dy * s], r = s <= st.Lu ? rAt(st.upper, s) : rAt(st.fore, s - st.Lu);
    let out = 0; const n = 21;
    for (let k = 0; k < n; k++) { const t = -1 + 2 * (k + 0.5) / n; if (!Fig.pointInPoly([p[0] + t * r * Math.cos(a), p[1] + t * r * Math.sin(a)], body)) out++; }
    v += Math.PI * r * r * ds * out / n;
  }
  const hs = [[0, d.wristR * 0.95], [0.35 * d.handL, d.handB * 0.36], [0.75 * d.handL, d.handB * 0.32], [d.handL * 0.95, d.handB * 0.22]];
  const dh = d.handL / 500; let vh = 0; for (let s = dh / 2; s < d.handL * 0.95; s += dh) { const r = rAt(hs, s); vh += Math.PI * r * r * dh; }
  return 2 * (v + vh);
}
const S = (V) => 1.8 * V * 1060 * 0.925 / Math.pow(H, 3);
for (const t of LIM.templates) {
  const r = calc.compute({ buildId: t.id, heightM: H }); const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const opts = (x) => Object.assign({ buttockFit: BC.FRUSTUM.M.buttock }, x);
  const base = Fig.human(T, H, g, {}, opts({ armDeg: 35 }));
  const make = (f, deg) => Fig.human(T, H, g, {}, opts({ widthScale: f, legAxis: base.dims.legAxis, armDeg: deg }));
  const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const f = t.face.f, rest = Fig.armRestAngle((deg) => make(f, deg)), deg = Math.max(35, rest + 2), fig = make(f, deg);
  const full = measureViews({ front: fig.front, side: fig.side }, H, lv, 800).res;
  const noArms = fig.front.filter((p) => !/arm|hand/.test(p.name));
  const bare = measureViews({ front: noArms, side: fig.side }, H, lv, 800).res;
  const av = armVol(fig, deg);
  console.log(t.id.padEnd(22), 'f', f, 'rest', rest.toFixed(1), 'drawn at', deg.toFixed(1),
    '| tool full', full.score.value.toFixed(1), '(stored', t.face.score + ')', 'arms found:', full.volume_m3.parts.arms.toFixed(4),
    '| tool w/o arms', bare.score.value.toFixed(1), '+ arms by revolution', S(av).toFixed(1), '=', (bare.score.value + S(av)).toFixed(1),
    '| overstated by', ((full.score.value / (bare.score.value + S(av)) - 1) * 100).toFixed(0) + '%', '| ok', full.ok, '| warnings:', full.warnings.filter((w) => /arm/.test(w)).join(' / ').slice(0, 120));
}
// The same check at the arms and thighs limits of the median soldier (arms at 35-39 deg: found by the tool)
