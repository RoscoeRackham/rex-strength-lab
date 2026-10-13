const fs = require('fs'), path = require('path');
const LAB = '/home/user/rex-strength-lab/rex-strength-lab';
const src = fs.readFileSync(LAB + '/src/engine.js', 'utf8');
const M = {
  e01_fly_ignores_absorb: ["const dk = -cd * A / (2 * m) * rho * v * dK;\n      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];\n    };\n    let steps = 0;\n    let maxMach", "const dk = -cd * A / (2 * m) * rho * v;\n      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];\n    };\n    let steps = 0;\n    let maxMach"],
  e02_ownrecoil_slides: ["const ownAnchor = (c) => (c.ownRecoil ? 'bolted' : c.anchor);", "const ownAnchor = (c) => c.anchor;"],
  e03_toground_adds_recoil: ["const J = pObj === Infinity ? Infinity : Math.max(0, pObj - pRecoil), T = Math.max(limbPulse(body), push.t);", "const J = pObj === Infinity ? Infinity : Math.max(0, pObj + pRecoil), T = Math.max(limbPulse(body), push.t);"],
  e04_weak_no_weight: ["const bear = Math.max(0, qultFor(ctx.surface, body.footB) * 2 * body.footArea - weight), cap = bear * T;", "const bear = Math.max(0, qultFor(ctx.surface, body.footB) * 2 * body.footArea), cap = bear * T;"],
  e05_weak_drop_sideways: ["return { J: Math.hypot(Jh, cap), whole: J, supplied: Jd - cap };", "return { J: cap, whole: J, supplied: Jd - cap };"],
  e06_weak_sideways_capped_too: ["const Jd = J * Math.max(0, Math.sin(th)), Jh =", "const Jd = J, Jh0 ="],
  e14_catch_weight_no_obj: ["out.toGroundC = Object.assign(weakGround(ctxC, bC, J, (out.angleDeg || 0) * Math.PI / 180, T, (bC.m + obj.m) * K.g), { T });", "out.toGroundC = Object.assign(weakGround(ctxC, bC, J, (out.angleDeg || 0) * Math.PI / 180, T, bC.m * K.g), { T });"],
  e15_toss_catch_weight_no_obj: ["out.toGroundC = Object.assign(weakGround(ctxT, ctxT.body, J, Math.PI / 2, T, (ctxT.body.m + obj.m) * K.g), { T });", "out.toGroundC = Object.assign(weakGround(ctxT, ctxT.body, J, Math.PI / 2, T, ctxT.body.m * K.g), { T });"],
  e17_weak_without_unbreakable: ["if (!ctx.unbreakable || !isFinite(J) || !(J > 0) || !(T > 0)) return { J };", "if (!(ctx.unbreakable || ctx.ownRecoil) || !isFinite(J) || !(J > 0) || !(T > 0)) return { J };"],
  e19_collide_held_cap_off: ["if (out.toGround && hb.why === 'unbreakable' && isFinite(out.toGround.J)) {", "if (false) {"],
  e20_growth_cap_off: ["Jg = Math.min(J, bear * tau);\n      extra = { toGround:", "Jg = J;\n      extra = { toGround:"],
  e21_landing_cap_off: ["const cap = (J, T) => (o.unbreakable && r.landBear != null ? Math.min(J, r.landBear * T) : J);", "const cap = (J, T) => J;"],
  e22_throwpushj_T_ignored: ["return weakGround(ctxT, ctxT.body, J, th * Math.PI / 180, T || Math.max(", "return weakGround(ctxT, ctxT.body, J, th * Math.PI / 180, 10 * (T || 1) || Math.max("],
  e23_hand_gamma1: ["return handAir(o.body, o.obj, r.v, gamma, r.push ? r.push.EA + r.push.EB : undefined);", "return handAir(o.body, o.obj, r.v, 1, r.push ? r.push.EA + r.push.EB : undefined);"],
  e24_orbit_no_hill: ["if (c0.ra > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = c0.ra - R; return out; }\n        out.orbit = true; out.apex = c0.ra - R; return out;\n      }\n    }\n\n    const acc", "out.orbit = true; out.apex = c0.ra - R; return out;\n      }\n    }\n\n    const acc"],
};
for (const [k, [a, b]] of Object.entries(M)) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP ' + k + ': ' + n + ' matches'); continue; }
  const d = path.join(__dirname, k);
  fs.mkdirSync(path.join(d, 'src'), { recursive: true }); fs.mkdirSync(path.join(d, 'test', 'fixtures'), { recursive: true });
  fs.writeFileSync(path.join(d, 'src', 'engine.js'), src.replace(a, b));
  for (const f of ['src/data.js', 'test/powers.js', 'test/powers-off-cases.js']) fs.copyFileSync(path.join(LAB, f), path.join(d, f));
  fs.writeFileSync(path.join(d, 'test/fixtures/powers-off.json'), '{"fingerprints":{}}');
  console.log('wrote ' + k);
}
