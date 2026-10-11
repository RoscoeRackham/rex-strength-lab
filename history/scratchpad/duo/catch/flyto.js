// fly() from engine.js with three additions proposed for the catch game:
//   o.hStop  : stop when the object comes DOWN through this height (the catcher's hands), not the ground.
//              If it never gets that high it stops at the ground and reports belowStop.
//   o.Rn     : nose radius (m). When given, integrates Sutton-Graves stagnation heating
//              q = K_SG sqrt(rho/Rn) v^3 along the path: heatLoad (J/m^2) and qMax (W/m^2).
//   out.vMin : (unchanged semantics elsewhere) not used.
global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
const SG_K = 1.7415e-4;   // Sutton & Graves 1971, Earth air, SI (W/m^2 with rho kg/m^3, Rn m, v m/s)

function flyTo(oIn) {
  let o = oIn;
  const { v0, m, A } = o;
  const Cd = o.Cd, CdSup = o.CdSup;
  const theta = (o.thetaDeg == null ? 45 : o.thetaDeg) * Math.PI / 180;
  const h0 = o.h0 || 0;
  const hStop = o.hStop || 0;
  const R = K.R_E;
  const Rs = R + hStop;
  const SPACE = 150e3;
  const machCd = P.cdAt(Cd, CdSup, v0 / K.a0);
  const Rn = o.Rn || 0;
  const out = {
    v0, range: 0, apex: h0, time: 0, vImpact: 0, impactAngleDeg: 0,
    escaped: false, orbit: false, landed: false, timedOut: false, relativistic: false, belowStop: false,
    maxMach: v0 / K.a0, maxStagT: P.stagnationT(v0),
    eFold: Cd > 0 ? 2 * m / (K.rho0 * machCd * A) : Infinity,
    heatLoad: 0, qMax: 0,
    crossedX: false, hAtX: 0, vAtX: 0, angleAtXDeg: 0,
    steps: 0,
  };
  const xStop = o.xStop || Infinity;
  if (!(v0 > 0)) { out.landed = true; return out; }
  if (v0 > 0.01 * K.c || !isFinite(v0)) { out.relativistic = true; return out; }
  const vacuum = !(Cd > 0);
  let x = 0, y = R + h0;
  let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
  let t = 0, ang = 0;
  const tMax = o.tMax || 400 * 86400;
  const path = o.record ? [[0, h0]] : null;
  let above = h0 >= hStop;   // has it been at or above the catch height yet?

  if (vacuum && !o._noVac) {
    if (!above || isFinite(xStop)) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
    const c = P.conicTo(x, y, vx, vy, Rs);
    if (c.radial) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
    if (c.escaped) { out.escaped = true; return out; }
    if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = (c.orbit ? c.ra : c.apexR) - R; return out; }
    if (c.orbit) { out.orbit = true; out.apex = c.ra - R; return out; }
    out.apex = c.apexR - R;
    out.time = c.dt; out.range = R * Math.abs(c.dPhi); out.landed = true;
    out.vImpact = Math.hypot(c.vx, c.vy);
    out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(c.x * c.vx + c.y * c.vy) / (Rs * out.vImpact))) * 180 / Math.PI;
    return out;
  }

  const acc = (x_, y_, vx_, vy_) => {
    const r2 = x_ * x_ + y_ * y_;
    const r = Math.sqrt(r2);
    const rho = P.rhoAt(r - R);
    const v = Math.hypot(vx_, vy_);
    const cd = P.cdAt(Cd, CdSup, v / K.a0);
    const gk = -K.GM / (r2 * r);
    const dk = -cd * A / (2 * m) * rho * v;
    return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
  };
  let steps = 0, maxMach = 0, lastRec = 0;
  while (true) {
    if (steps >= 3000000 || t > tMax) { out.timedOut = true; break; }
    const r = Math.hypot(x, y);
    if (r > K.R_HILL) { out.escaped = true; out.leavesHill = true; break; }
    const v = Math.hypot(vx, vy);
    const hNow = r - R;
    if (hNow > SPACE && !o._noVac && (x * vx + y * vy) > 0) {
      const c = P.conicTo(x, y, vx, vy, R + SPACE);
      if (c.radial) { o = Object.assign({}, o, { _noVac: true }); continue; }
      if (c.escaped) { out.escaped = true; break; }
      if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = Math.max(out.apex, (c.orbit ? c.ra : c.apexR) - R); break; }
      if (c.orbit) { out.orbit = true; out.apex = Math.max(out.apex, c.ra - R); break; }
      out.apex = Math.max(out.apex, c.apexR - R);
      if (R * Math.abs(ang + c.dPhi) >= xStop) { out.crossedX = true; out.hAtX = Infinity; out.vAtX = NaN; out.inSpaceAtX = true; break; }
      if (path) {
        const segs = 48;
        for (let i = 1; i <= segs; i++) {
          const fr = i / segs;
          const phi = ang + c.dPhi * fr;
          const hh = c.p / (1 + c.e * Math.cos(c.f0 + Math.abs(c.dPhi) * fr)) - R;
          path.push([R * Math.abs(phi), Math.max(0, hh), true]);
        }
      }
      x = c.x; y = c.y; vx = c.vx; vy = c.vy; t += c.dt; ang += c.dPhi;
      above = true;
      continue;
    }
    const [ax, ay] = acc(x, y, vx, vy);
    const a = Math.hypot(ax, ay);
    let dt = 0.002 * Math.max(v, 1e-3) / Math.max(a, 1e-9);
    dt = Math.min(dt, 0.002 * r / Math.max(v, 1e-9));
    const hAboveStop = above ? r - Rs : hNow;
    if (x * vx + y * vy < 0) dt = Math.min(dt, Math.max(0.5, 0.05 * hAboveStop) / Math.max(v, 1e-9));
    dt = Math.max(dt, 1e-9);
    const k1v = [ax, ay], k1x = [vx, vy];
    const k2x = [vx + 0.5 * dt * k1v[0], vy + 0.5 * dt * k1v[1]];
    const k2v = acc(x + 0.5 * dt * k1x[0], y + 0.5 * dt * k1x[1], k2x[0], k2x[1]);
    const k3x = [vx + 0.5 * dt * k2v[0], vy + 0.5 * dt * k2v[1]];
    const k3v = acc(x + 0.5 * dt * k2x[0], y + 0.5 * dt * k2x[1], k3x[0], k3x[1]);
    const k4x = [vx + dt * k3v[0], vy + dt * k3v[1]];
    const k4v = acc(x + dt * k3x[0], y + dt * k3x[1], k4x[0], k4x[1]);
    const nx = x + dt / 6 * (k1x[0] + 2 * k2x[0] + 2 * k3x[0] + k4x[0]);
    const ny = y + dt / 6 * (k1x[1] + 2 * k2x[1] + 2 * k3x[1] + k4x[1]);
    const nvx = vx + dt / 6 * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]);
    const nvy = vy + dt / 6 * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1]);
    const nr = Math.hypot(nx, ny);
    let dAng = Math.atan2(nx, ny) - Math.atan2(x, y);
    if (dAng > Math.PI) dAng -= 2 * Math.PI;
    if (dAng < -Math.PI) dAng += 2 * Math.PI;
    // ground distance xStop reached first (direct throws): state where it passes him
    if (isFinite(xStop) && R * Math.abs(ang + dAng) >= xStop && nr >= R) {
      const f = (xStop - R * Math.abs(ang)) / Math.max(R * Math.abs(dAng), 1e-12);
      const ix = x + (nx - x) * f, iy = y + (ny - y) * f, ivx = vx + (nvx - vx) * f, ivy = vy + (nvy - vy) * f;
      const ir = Math.hypot(ix, iy), vI = Math.hypot(ivx, ivy), vr = (ix * ivx + iy * ivy) / ir;
      if (Rn > 0) { const q = SG_K * Math.sqrt(P.rhoAt(hNow) / Rn) * v * v * v; out.heatLoad += q * dt * f; out.qMax = Math.max(out.qMax, q); }
      t += dt * f; ang += dAng * f;
      out.crossedX = true; out.hAtX = ir - R; out.vAtX = vI; out.angleAtXDeg = -Math.asin(Math.max(-1, Math.min(1, vr / Math.max(vI, 1e-12)))) * 180 / Math.PI;
      if (path) path.push([R * Math.abs(ang), ir - R]);
      break;
    }
    // stop surface: the catch height once it has been above it, otherwise the ground
    const rStop = above ? Rs : R;
    if (nr < rStop) {
      const f = (r - rStop) / Math.max(r - nr, 1e-12);
      ang += dAng * f;
      t += dt * f;
      if (Rn > 0) { const q = SG_K * Math.sqrt(P.rhoAt(hNow) / Rn) * v * v * v; out.heatLoad += q * dt * f; out.qMax = Math.max(out.qMax, q); }
      const ivx = vx + (nvx - vx) * f, ivy = vy + (nvy - vy) * f;
      const ix = x + (nx - x) * f, iy = y + (ny - y) * f;
      const ir = Math.hypot(ix, iy);
      const vr = (ix * ivx + iy * ivy) / ir;
      const vImp = Math.hypot(ivx, ivy);
      out.vImpact = vImp;
      out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(vr) / Math.max(vImp, 1e-12))) * 180 / Math.PI;
      out.landed = true;
      out.belowStop = !above && hStop > 0;
      if (path) path.push([R * Math.abs(ang), rStop - R]);
      break;
    }
    if (Rn > 0) { const q = SG_K * Math.sqrt(P.rhoAt(hNow) / Rn) * v * v * v; out.heatLoad += q * dt; out.qMax = Math.max(out.qMax, q); }
    x = nx; y = ny; vx = nvx; vy = nvy; t += dt; ang += dAng;
    if (!above && nr >= Rs) above = true;
    steps++;
    if (path && steps - lastRec >= 1) { path.push([R * Math.abs(ang), nr - R]); lastRec = steps; }
    const hN = nr - R;
    if (hN > out.apex) out.apex = hN;
    const vN = Math.hypot(vx, vy);
    if (hN < 80000) maxMach = Math.max(maxMach, vN / K.a0);
  }
  out.steps = steps;
  out.time = t;
  out.range = R * Math.abs(ang);
  out.maxMach = Math.max(maxMach, v0 / K.a0);
  out.maxStagT = P.stagnationT(out.maxMach * K.a0);
  if (path) {
    const stride = Math.max(1, Math.ceil(path.length / 400));
    out.path = path.filter((pt, i) => pt[2] || i % stride === 0 || i === path.length - 1);
  }
  return out;
}
module.exports = { flyTo, SG_K, P, K };
