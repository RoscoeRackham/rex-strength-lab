const fs = require('fs'), path = require('path');
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const M = {
  // a catch fireball loses the exact relativistic energy (a refactor slip in the fireball path)
  'mA-fireball-E': ["fireball: fireballAt(obj, v, Dfl, ctxC, rel ? r.Eobj : null, dK) });", "fireball: fireballAt(obj, v, Dfl, ctxC, null, dK) });"],
  // the well-dominated catch (dense bodies) throws everything even in the easy style
  'mB-well-easy': ["vL = style === 'easy' ? need : vMax;", "vL = vMax;"],
  // the catch's first-contact heat counted relativistically from 0.1% of light speed
  'mC-catchIt-rel': ["const rel = v >= 0.01 * K.c, pIn", "const rel = v >= 0.001 * K.c, pIn"],
  // the toss's fireball speed threshold
  'mD-toss': ["if (v >= CATCH.V_FIREBALL) return Object.assign(out, dK > 0 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true });", "if (v >= 0.5 * CATCH.V_FIREBALL) return Object.assign(out, dK > 0 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true });"],
  // the well-dominated catch's arrival: drag scaled wrongly
  'mE-wellRun': ["k0 = K.rho0 * obj.area / obj.m * dK,", "k0 = K.rho0 * obj.area / obj.m * dK * 1.01,"],
  // the catch's miss on to the ground (non-fast)
  'mF-relthrow-blast': ["if (k >= 1) return { land: r.Eobj, path: 0 };", "if (k >= 1) return { land: 0.5 * r.Eobj, path: 0 };"],
};
for (const [name, [a, b]] of Object.entries(M)) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log(name, 'pattern found', n, 'times'); continue; }
  fs.writeFileSync(path.join(__dirname, name + '.js'), src.replace(a, b));
  console.log('wrote', name);
}
