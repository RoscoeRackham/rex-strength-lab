const { P, D, g, R3, O3, surf, mk } = require('./eng.js')(process.argv[2]);
const f = (x) => (x == null ? '-' : typeof x === 'number' ? Number(x.toPrecision(5)) : x);
for (const beta of [1e-8, 6e-8, 3.3e-7, 3.3e-6, 1e-3, 0.0099, 0.0101, 0.1]) {
  const gb = beta / Math.sqrt(1 - beta * beta);
  const r = P.collide(mk({ body: O3 }), mk(), { source: 'set', gb, bounce: true });
  const b = r.after && r.after.bounce;
  console.log('beta', beta, 'v', f(r.vRel), 'T', f(r.contact && r.contact.softEl && r.contact.softEl.t), 'during', f(b && b.during), 'pi s', f(Math.PI * (r.contact && r.contact.s)), 'slideB', f(b && b.slideB), 'moved', f(b && b.moved), 'vB', f(b && b.vB), 'bound', r.bound);
}
