// Independent recomputation of the median soldier's limits.
// (1) width factors where each test is reached, by my own bisection on the figure tests;
// (2) the drawn shape's volume by my own polygon integration (no raster): trunk/legs/neck as
//     ellipses of front width x side depth, arms as solids of revolution outside the body, head as an
//     ellipsoid; compared with the stored scores (the tool's raster reading).
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const builds = require(B + '/build-calculator/data/builds.json');
const Fig = require(B + '/build-comparison/src/figure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const settings = require(B + '/build-comparison/data/settings.json');
const { measureViews } = require(B + '/build-comparison/tools/export_targets.js');
const calc = BC.create(builds);
const H = 1.8;
function maker(id) {
  const r = calc.compute({ buildId: id, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const opts = (x) => Object.assign({ buttockFit: BC.FRUSTUM.M.buttock }, x);
  const base = Fig.human(T, H, g, {}, opts({ armDeg: 35 }));
  return { g, base, make: (f, deg) => Fig.human(T, H, g, {}, opts({ widthScale: f, legAxis: base.dims.legAxis, armDeg: deg })) };
}
// crossings of a polygon with the horizontal line y: sorted x list
function xings(poly, y) {
  const xs = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j], b = poly[i];
    if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
  }
  return xs.sort((p, q) => p - q);
}
function runsOf(poly, y) { const xs = xings(poly, y), out = []; for (let k = 0; k + 1 < xs.length; k += 2) out.push([xs[k], xs[k + 1]]); return out; }
function volumeOf(fig) {
  const body = fig.front.find((p) => p.name === 'body').poly, sideBody = fig.side.find((p) => p.name === 'body').poly;
  const d = fig.dims, dy = 0.0005;
  let trunk = 0;
  for (let y = dy / 2; y < d.levels.top; y += dy) {
    const rr = runsOf(body, y); if (!rr.length) continue;
    const sr = runsOf(sideBody, y); const depth = sr.reduce((m, r) => Math.max(m, r[1] - r[0]), 0);
    for (const r of rr) trunk += Math.PI / 4 * (r[1] - r[0]) * depth * dy;
  }
  // head: ellipsoid, front width headB*1.02, side length headL, height headH (the parts above the neck top)
  const head = Math.PI / 6 * (d.headB * 1.02) * d.headL * d.headH;
  // arms: solids of revolution along the axis, counting only the stretch whose axis point is outside the body
  const st = d.armStations, sj = d.shoulderJoint;
  const radiusAt = (stn, s) => { if (s <= stn[0][0]) return stn[0][1]; for (let i = 1; i < stn.length; i++) if (s <= stn[i][0]) return stn[i - 1][1] + (stn[i][1] - stn[i - 1][1]) * (s - stn[i - 1][0]) / (stn[i][0] - stn[i - 1][0]); return stn[stn.length - 1][1]; };
  const armPoly = fig.front.find((p) => p.name === 'left upper arm').poly;
  // recover arm angle from the upper-arm polygon: the elbow cap centre is Lu along the axis
  return { trunk, head, st, sj, radiusAt };
}
function armVolume(fig, deg) {
  const d = fig.dims, body = fig.front.find((p) => p.name === 'body').poly, st = d.armStations, sj = d.shoulderJoint;
  const a = deg * Math.PI / 180, dx = Math.sin(a), dyy = -Math.cos(a);
  const rAt = (stn, s) => { if (s <= stn[0][0]) return stn[0][1]; for (let i = 1; i < stn.length; i++) if (s <= stn[i][0]) return stn[i - 1][1] + (stn[i][1] - stn[i - 1][1]) * (s - stn[i - 1][0]) / (stn[i][0] - stn[i - 1][0]); return stn[stn.length - 1][1]; };
  const L = st.Lu + st.Lf, ds = L / 2000; let v = 0;
  for (let s = ds / 2; s < L; s += ds) {
    const p = [sj[0] + dx * s, sj[1] + dyy * s];
    // fraction of the cross-section disc outside the body: sample across the diameter
    const r = s <= st.Lu ? rAt(st.upper, s) : rAt(st.fore, s - st.Lu);
    let out = 0, n = 21;
    for (let k = 0; k < n; k++) { const t = -1 + 2 * (k + 0.5) / n; const q = [p[0] + t * r * Math.cos(a), p[1] + t * r * Math.sin(a)]; if (!Fig.pointInPoly(q, body)) out++; }
    v += Math.PI * r * r * ds * out / n;
  }
  // hand: flat-ish; the tool treats it as round (pi/4 w^2 per row); use round with its drawn half widths
  const handSt = [[0, d.wristR * 0.95], [0.35 * d.handL, d.handB * 0.36], [0.75 * d.handL, d.handB * 0.32], [d.handL * 0.95, d.handB * 0.22]];
  const dh = d.handL / 500; let vh = 0;
  for (let s = dh / 2; s < d.handL * 0.95; s += dh) { const r = rAt(handSt, s); vh += Math.PI * r * r * dh; }
  return 2 * (v + vh);
}
function score(fig, deg) {
  const vb = volumeOf(fig), va = armVolume(fig, deg);
  const V = vb.trunk + vb.head + va;
  return { V, S: 1.8 * V * 1060 * 0.925 / Math.pow(H, 3), parts: { trunk: vb.trunk, head: vb.head, arms: va } };
}
const L = settings.limits;
const m = maker('ansur2_m_p50');
const crease = LIM.elbow_crease_fraction_of_upper_arm * m.base.dims.armStations.Lu;
const tests = {
  arms: (f) => Fig.armRestAngle((deg) => m.make(f, deg)) >= L.arms.angle_deg,
  thighs: (f) => Fig.thighContact(m.make(f)) >= L.thighs.fraction,
  face: (f) => Fig.elbowFlexion(m.make(f), crease) < L.face.max_flexion_deg,
};
const bis = (t) => { let lo = 0.5, hi = 6; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (t(mid)) hi = mid; else lo = mid; } return hi; };
const main = LIM.templates.find((t) => t.id === 'ansur2_m_p50');
const out = {};
for (const k of ['arms', 'thighs', 'face', 'f1']) {
  const f = k === 'f1' ? 1 : bis(tests[k]);
  const rest = Fig.armRestAngle((deg) => m.make(f, deg)), deg = Math.max(35, rest + 2);
  const fig = m.make(f, deg);
  const mine = score(fig, deg);
  const tool800 = measureViews({ front: fig.front, side: fig.side }, H, { shoulder: fig.dims.levels.acromion, chest: fig.dims.levels.chest, waist: fig.dims.levels.waist, crotch: fig.dims.levels.crotch, knee: fig.dims.levels.knee }, 800).res;
  const tool2000 = measureViews({ front: fig.front, side: fig.side }, H, { shoulder: fig.dims.levels.acromion, chest: fig.dims.levels.chest, waist: fig.dims.levels.waist, crotch: fig.dims.levels.crotch, knee: fig.dims.levels.knee }, 2000).res;
  out[k] = { f: +f.toFixed(4), stored_f: k === 'f1' ? 1 : main[k].f, armDeg: +deg.toFixed(1), my_score: +mine.S.toFixed(2), tool_800: +tool800.score.value.toFixed(2), tool_2000: +tool2000.score.value.toFixed(2), tool_ok: tool2000.ok, stored: k === 'f1' ? main.score_at_f1 : main[k].score, my_parts_m3: Object.fromEntries(Object.entries(mine.parts).map(([a, b]) => [a, +b.toFixed(4)])), tool_parts_m3: Object.fromEntries(Object.entries(tool2000.volume_m3.parts).map(([a, b]) => [a, +b.toFixed(4)])) };
}
console.log(JSON.stringify(out, null, 1));
// thighs: closed form f = legAxis / lowThighR(f=1) (if the lower thigh closes last)
const d1 = m.base.dims;
console.log('thigh closed form f =', (d1.legAxis / d1.lowThighR).toFixed(4), 'legAxis', d1.legAxis.toFixed(4), 'lowThighR', d1.lowThighR.toFixed(4), 'thighW', d1.thighW.toFixed(4));
// daylight just above the knee for the median soldier at his own height and at 1.80
const e = calc.compute({ buildId: 'ansur2_m_p50' }); const g2 = {}; for (const s of BC.SITES) g2[s] = e.girths[s].value;
const own = Fig.human(T, e.height.value, g2, {}, { buttockFit: BC.FRUSTUM.M.buttock });
console.log('own height', e.height.value, 'gap at lowThigh (2*(legAxis-lowThighR)) =', (2 * (own.dims.legAxis - own.dims.lowThighR) * 100).toFixed(1), 'cm; at 1.80:', (2 * (d1.legAxis - d1.lowThighR) * 100).toFixed(1), 'cm; hip joint spacing own', (2 * own.dims.hipJointHalf * 100).toFixed(1), 'cm');
