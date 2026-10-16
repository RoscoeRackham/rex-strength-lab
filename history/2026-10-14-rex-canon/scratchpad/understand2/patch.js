const fs = require('fs');
let s = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('match ' + n + ': ' + a.slice(0, 80)); s = s.replace(a, b); };
// 1. throwOnce: the feet carry only the weights when he takes his own recoil; toGround only for Unbreakable footing without it; recoilAbsorbed
rep("const Nfeet = isFinite(Fload) ? anc.N(Fload) : (Math.sin(th) > 1e-12 ? Infinity : anc.N(0));",
    "const Nfeet = process.env.NOSINK ? (isFinite(Fload) ? anc.N(Fload) : (Math.sin(th) > 1e-12 ? Infinity : anc.N(0))) : ctx.ownRecoil ? (body.m + obj.m) * K.g : isFinite(Fload) ? anc.N(Fload) : (Math.sin(th) > 1e-12 ? Infinity : anc.N(0));");
rep("    if ((ctx.ownRecoil || ctx.unbreakable) && !push.stalled && v > 0) {\n      const J = pObj === Infinity ? Infinity : Math.max(0, pObj - pRecoil), T = Math.max(limbPulse(body), push.t);\n      extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T });\n    }",
    "    if ((ctx.ownRecoil || ctx.unbreakable) && !push.stalled && v > 0) {\n      const J = pObj === Infinity ? Infinity : Math.max(0, pObj - pRecoil), T = Math.max(limbPulse(body), push.t);\n      if (ctx.ownRecoil) extra.recoilAbsorbed = { J, T };\n      else extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T });\n    }");
// 2. stomp: the upward push on his body goes to his source
rep("    const extra = {};\n    if (ctx.unbreakable) {\n      // what the ground held off",
    "    const extra = {};\n    if (ctx.ownRecoil && !ctx.stompLaunch) extra.recoilAbsorbed = { J: push.pB, T: push.t };\n    if (ctx.unbreakable) {\n      // what the ground held off");
// 3. punch: the push back goes to his source during the punch; the arm's stop hands it straight back
rep("    return Object.assign({}, {\n      F, push, anchor: anc, vFist: push.vB,",
    "    return Object.assign(ctx.ownRecoil ? { recoilAbsorbed: { J: push.pB, T: push.t, net: 0 } } : {}, {\n      F, push, anchor: anc, vFist: push.vB,");
// 4. pull: the rope's pull back goes to his source
rep("    const t10m = net > 0 ? Math.sqrt(2 * 10 / accel + (10 / K.c) ** 2) : Infinity;",
    "    const t10m = net > 0 ? Math.sqrt(2 * 10 / accel + (10 / K.c) ** 2) : Infinity;\n    if (ctx.ownRecoil && net > 0) ownLimit.recoilAbsorbed = { J: ownLimit.ropeT * t10m, T: t10m };");
// 5. MOVES.throw.shake / shakeFrom: his push counts only with Unbreakable footing and without his recoil taken
rep("          if (!((o.ownRecoil || o.unbreakable) && r.toGround)) return land;", "          if (!(o.unbreakable && !o.ownRecoil && r.toGround)) return land;");
rep("          if (!((o.ownRecoil || o.unbreakable) && r.toGround)) return 'landing';", "          if (!(o.unbreakable && !o.ownRecoil && r.toGround)) return 'landing';");
// 6. MOVES.pull: no shaking source
rep("        shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m) && r.t10m > 0 ? impulseSource(o.surface, vToMomentum(r.vEnd, o.obj.m) + r.resist * r.t10m, r.t10m) : null),\n        shakeWithPower: 'ownRecoil',\n", "");
// 7. weakGround: the sideways part whole only for a bolted foot
rep("const capH = (bolted != null ? bolted : ownAnchor(ctx) === 'bolted') ? Infinity", "const capH = (bolted != null ? bolted : ctx.anchor === 'bolted') ? Infinity");
// 8. CATCHGAME gates (duo, for completeness): the thrower's push, the toss's push and the catches
rep("        if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) { const T = Math.max(limbPulse(bT)", "        if (ctxT.unbreakable && !ctxT.ownRecoil && v > 0) { const T = Math.max(limbPulse(bT)");
rep("      if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) {\n        const T = Math.max(limbPulse(ctxT.body), 2 * strokeOf(ctxT.body, obj) / v);", "      if (ctxT.unbreakable && !ctxT.ownRecoil && v > 0) {\n        const T = Math.max(limbPulse(ctxT.body), 2 * strokeOf(ctxT.body, obj) / v);");
rep("      if (ctxT.unbreakable) {\n        const k = out.catch,", "      if (ctxT.unbreakable && !ctxT.ownRecoil) {\n        const k = out.catch,");
rep("      if (ctxC.unbreakable && (out.result === 'caught'", "      if (ctxC.unbreakable && !ctxC.ownRecoil && (out.result === 'caught'");
fs.writeFileSync(__dirname + '/engine-new.js', s);
console.log('patched ok');
