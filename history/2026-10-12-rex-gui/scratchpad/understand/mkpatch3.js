const fs=require('fs');
let s=fs.readFileSync('engine-trial.js','utf8');
const rep=(a,b,all)=>{ if(!s.includes(a)) throw new Error('missing: '+a.slice(0,80)); s=all?s.split(a).join(b):s.replace(a,b); };
rep(`    function flyTo(oIn) {
      let o = oIn;
      const { v0, m, A } = o;`, `    function flyTo(oIn) {
      let o = oIn;
      const { v0, m, A } = o;
      const fD = o.dragF == null ? 1 : o.dragF;`);
rep(`          out.heatLoad += q * dtt; out.qMax = Math.max(out.qMax, q);
          if (hh < RAD_H) out.radLoad += SIGMA_SB * Math.max(0, Math.pow(stagnationT(vv), 4) - Math.pow(K.T0, 4)) * dtt;`, `          out.heatLoad += fD * q * dtt; out.qMax = Math.max(out.qMax, fD * q);
          if (hh < RAD_H) out.radLoad += fD * SIGMA_SB * Math.max(0, Math.pow(stagnationT(vv), 4) - Math.pow(K.T0, 4)) * dtt;`);
rep(`        const eD = 0.5 * cdAt(Cd, CdSup, vv / K.a0) * rho * A * vv * vv * vv * dtt;
        out.dragE += eD;`, `        const eD0 = 0.5 * cdAt(Cd, CdSup, vv / K.a0) * rho * A * vv * vv * vv * dtt, eD = fD * eD0;
        out.oceanE = (out.oceanE || 0) + (1 - fD) * eD0;
        out.dragE += eD;`);
rep(`      const vacuum = !(Cd > 0);
      let x = 0, y = R + h0;
      let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
      let t = 0, ang = 0;
      const tMax = o.tMax || 400 * 86400;
      const path = o.record ? [[0, h0]] : null;
      let above = h0 >= hStop;`, `      const vacuum = !(Cd > 0) || fD === 0;
      let x = 0, y = R + h0;
      let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
      let t = 0, ang = 0;
      const tMax = o.tMax || 400 * 86400;
      const path = o.record ? [[0, h0]] : null;
      let above = h0 >= hStop;`);
rep(`        if (!above || isFinite(xStop)) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
        const c = conicTo(x, y, vx, vy, Rs);
        if (c.radial) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));`, `        if (!above || isFinite(xStop)) return flyTo(Object.assign({}, o, fD === 0 && Cd > 0 ? { _noVac: true } : { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
        const c = conicTo(x, y, vx, vy, Rs);
        if (c.radial) return flyTo(Object.assign({}, o, fD === 0 && Cd > 0 ? { _noVac: true } : { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));`);
// vacuum check inside: _noVac with fD 0 should integrate: 'vacuum && !o._noVac' already guards
rep(`        const cd = cdAt(Cd, CdSup, v / K.a0);
        const gk = -K.GM / (r2 * r);
        const dk = -cd * A / (2 * m) * rho * v;
        return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
      };
      let steps = 0, maxMach = 0, lastRec = 0;`, `        const cd = cdAt(Cd, CdSup, v / K.a0);
        const gk = -K.GM / (r2 * r);
        const dk = -cd * A / (2 * m) * rho * v * fD;
        return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
      };
      let steps = 0, maxMach = 0, lastRec = 0;`);
// flight() and leg flyTo calls: pass dragF from a module-level var set by leg
rep(`    function flight(obj, v, th, h0, hStop, record) {
      return flyTo({ v0: v, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record });`, `    let DRAGF = 1;
    function flight(obj, v, th, h0, hStop, record) {
      return flyTo({ v0: v, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record, dragF: DRAGF });`);
rep(`      const fx = (th) => flyTo({ v0: vOf(th), thetaDeg: th, h0, hStop: 0, xStop: D, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj) });`, `      const fx = (th) => flyTo({ v0: vOf(th), thetaDeg: th, h0, hStop: 0, xStop: D, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), dragF: DRAGF });`);
rep(`      const key = [obj.id, obj.m, obj.area, obj.Cd, obj.CdSup, D, h0, hStop].join('|');`, `      const key = [obj.id, obj.m, obj.area, obj.Cd, obj.CdSup, D, h0, hStop, DRAGF].join('|');`);
rep(`      const k = [key, obj.id, obj.m, obj.area, h0, hStop].join('|');`, `      const k = [key, obj.id, obj.m, obj.area, h0, hStop, DRAGF].join('|');`);
rep(`    function leg(ctxT, ctxC, obj, D, style) {
      const bT = ctxT.body, bC = ctxC.body;`, `    function leg(ctxT, ctxC, obj, D, style) {
      DRAGF = ctxT.airAbsorb == null ? 1 : 1 - ctxT.airAbsorb;
      const bT = ctxT.body, bC = ctxC.body;`);
rep(`        const fl = style === 'easy' ? flyTo({ v0: vE, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl })
          : flyTo({ v0: vE, thetaDeg: th, h0, hStop: 0, xStop: Dfl, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl });`, `        const fl = style === 'easy' ? flyTo({ v0: vE, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl, dragF: DRAGF })
          : flyTo({ v0: vE, thetaDeg: th, h0, hStop: 0, xStop: Dfl, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl, dragF: DRAGF });`);
// fireballAt: swept mass x f
rep(`      const unit = m / (K.rho0 * obj.area);`, `      const unit = m / (K.rho0 * obj.area * DRAGF);`);
fs.writeFileSync('engine-trial.js', s);
console.log('ok');
