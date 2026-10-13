const fs=require('fs');
let s=fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js','utf8');
const rep=(a,b)=>{ if(!s.includes(a)) throw new Error('missing: '+a.slice(0,80)); s=s.replace(a,b); };
// fly(): drag factor f = o.dragF (default 1); ocean integrals with share 1-f
rep(`  function fly(oIn) {
    let o = oIn;
    const { v0, m, A } = o;`, `  function fly(oIn) {
    let o = oIn;
    const { v0, m, A } = o;
    const fD = o.dragF == null ? 1 : o.dragF, sOc = 1 - fD;`);
rep(`    const vacuum = !(Cd > 0);
    let x = 0, y = R + h0;
    let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
    let t = 0, ang = 0;
    const tMax = o.tMax || 400 * 86400;
    const path = o.record ? [[0, h0]] : null;

    if (vacuum && !o._noVac) {`, `    const vacuum = !(Cd > 0) || (fD === 0 && !o._forceNum);
    let x = 0, y = R + h0;
    let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
    let t = 0, ang = 0;
    const tMax = o.tMax || 400 * 86400;
    const path = o.record ? [[0, h0]] : null;
    out.oceanE = 0; out.oceanPx = 0; out.oceanPy = 0;
    if (vacuum && !o._noVac && Cd > 0 && sOc > 0) {
      const num = fly(Object.assign({}, o, { _forceNum: true, record: false }));
      out.oceanE = num.oceanE; out.oceanP = num.oceanP; out.oceanPx = num.oceanPx; out.oceanPy = num.oceanPy; out._numRange = num.range; out._numApex = num.apex; out._numSteps = num.steps;
    }

    if (vacuum && !o._noVac) {`);
rep(`      const gk = -K.GM / (r2 * r);
      const dk = -cd * A / (2 * m) * rho * v;
      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
    };
    let steps = 0;
    let maxMach = 0;`, `      const gk = -K.GM / (r2 * r);
      const dk = -cd * A / (2 * m) * rho * v * fD;
      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
    };
    const realDrag = (x_, y_, vx_, vy_) => { const r = Math.hypot(x_, y_); const rho = rhoAt(r - R); const v = Math.hypot(vx_, vy_); const cd = cdAt(Cd, CdSup, v / K.a0); const k = cd * A / 2 * rho * v; return [k * vx_, k * vy_, k * v * v]; };
    let steps = 0;
    let maxMach = 0;`);
rep(`      const nr = Math.hypot(nx, ny);
      let dAng = Math.atan2(nx, ny) - Math.atan2(x, y);
      if (dAng > Math.PI) dAng -= 2 * Math.PI;
      if (dAng < -Math.PI) dAng += 2 * Math.PI;
      if (nr < R) {
        const f = (r - R) / Math.max(r - nr, 1e-12);`, `      const nr = Math.hypot(nx, ny);
      let dAng = Math.atan2(nx, ny) - Math.atan2(x, y);
      if (dAng > Math.PI) dAng -= 2 * Math.PI;
      if (dAng < -Math.PI) dAng += 2 * Math.PI;
      if (sOc > 0 && Cd > 0) { const d0 = realDrag(x, y, vx, vy), d1 = realDrag(nx, ny, nvx, nvy); const ff = nr < R ? (r - R) / Math.max(r - nr, 1e-12) : 1; out.oceanPx += sOc * 0.5 * (d0[0] + d1[0]) * dt * ff; out.oceanPy += sOc * 0.5 * (d0[1] + d1[1]) * dt * ff; out.oceanE += sOc * 0.5 * (d0[2] + d1[2]) * dt * ff; }
      if (nr < R) {
        const f = (r - R) / Math.max(r - nr, 1e-12);`);
rep(`    out.steps = steps;
    out.time = t;
    out.range = R * Math.abs(ang);
    out.maxMach = Math.max(maxMach, v0 / K.a0);`, `    out.steps = steps;
    out.oceanP = Math.hypot(out.oceanPx, out.oceanPy);
    out.time = t;
    out.range = R * Math.abs(ang);
    out.maxMach = Math.max(maxMach, v0 / K.a0);`);
// pass dragF from ctx.airAbsorb in throwOnce
rep(`      : fly({ v0: vOut, thetaDeg, h0: body.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, record: !!ctx.record });`,
    `      : fly({ v0: vOut, thetaDeg, h0: body.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, record: !!ctx.record, dragF: ctx.airAbsorb == null ? 1 : 1 - ctx.airAbsorb });`);
fs.writeFileSync('engine-trial.js', s);
console.log('ok');
