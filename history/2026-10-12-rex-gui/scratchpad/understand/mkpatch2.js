const fs=require('fs');
let s=fs.readFileSync('engine-trial.js','utf8');
const rep=(a,b)=>{ if(!s.includes(a)) throw new Error('missing: '+a.slice(0,80)); s=s.replace(a,b); };
rep(`      if (r.flight.relativistic) return { land: r.Eobj, path: 0 };
      const land = r.flight.landed ? shock(r.flight.vImpact, r.Eimpact) : 0;
      const drag = o && o.coolFlight ? 0 : shock(r.v, r.dragLoss != null ? r.dragLoss : r.Eobj);`,
`      const fA = 1 - ((o && o.airAbsorb) || 0);
      if (r.flight.relativistic) return { land: fA * r.Eobj, path: 0 };
      const land = r.flight.landed ? shock(r.flight.vImpact, r.Eimpact) : 0;
      const drag = o && o.coolFlight ? 0 : (fA > 0 ? shock(r.v, fA * (r.dragLoss != null ? r.dragLoss : r.Eobj)) : 0);`);
rep(`        boomSpeed: (r) => (r.canMove ? Math.max(r.v, r.recoilV || 0) : 0),`, `        boomSpeed: (r, o) => (r.canMove ? Math.max((o && o.airAbsorb >= 1) ? 0 : r.v, r.recoilV || 0) : 0),`);
rep(`      { id: 'boom', test: (m, r, o) => !(o.silentStrike && m.silent) && (m.boomSpeed || m.speed)(r) >= K.a0 },`, `      { id: 'boom', test: (m, r, o) => !(o.silentStrike && m.silent) && (m.boomSpeed || m.speed)(r, o) >= K.a0 },`);
rep(`PASSENGER.dragG(o.obj, r.v) > PASSENGER.noHarm(1)),`, `(1 - (o.airAbsorb || 0)) * PASSENGER.dragG(o.obj, r.v) > PASSENGER.noHarm(1)),`);
rep(`anchor: ctx.anchor, coolFlight: !!ctx.coolFlight }, o || {});`, `anchor: ctx.anchor, coolFlight: !!ctx.coolFlight, airAbsorb: ctx.airAbsorb || 0 }, o || {});`);
fs.writeFileSync('engine-trial.js', s);
console.log('ok');
