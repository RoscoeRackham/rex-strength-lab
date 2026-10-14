module.exports = [
  ['Oa-growth-uncapped', "J = g.m * vSole, Jg = Math.min(J, bear * tau);", "J = g.m * vSole, Jg = J;"],
  ['Ob-sideways-dropped', "return { J: Math.hypot(Jhg, Jdg), whole: J,", "return { J: Jdg, whole: J,"],
  ['Od-recoil-added', "Math.max(0, pObj - pRecoil), T = Math.max(limbPulse(body), push.t);", "Math.max(0, pObj + pRecoil), T = Math.max(limbPulse(body), push.t);"],
  ['Of-cap-ownrecoil-only', "if (!ctx.unbreakable || !(J > 0) || !(T > 0)) return { J };", "if (!(ctx.unbreakable || ctx.ownRecoil) || !(J > 0) || !(T > 0)) return { J };"],
  ['Og-tossT-x10', "T || Math.max(limbPulse(ctxT.body), vL > 0 ? 2 * strokeOf(ctxT.body, obj) / vL : 0), (ctxT.body.m + obj.m) * K.g);", "10 * (T || Math.max(limbPulse(ctxT.body), vL > 0 ? 2 * strokeOf(ctxT.body, obj) / vL : 0)), (ctxT.body.m + obj.m) * K.g);"],
  ['Oh-hill-off', "        if (c0.ra > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = c0.ra - R; return out; }\n        // (perigee", "        // (perigee"],
];
