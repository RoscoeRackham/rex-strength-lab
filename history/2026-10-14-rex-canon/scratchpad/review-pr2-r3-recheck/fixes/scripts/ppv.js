const path = require('path'), base = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/fixes/';
const load = (dir) => { global.window = {}; const e = path.join(dir, 'src/engine.js'), d = path.join(dir, 'src/data.js'); delete require.cache[require.resolve(e)]; delete require.cache[require.resolve(d)]; const P = require(e); require(d); return { P, D: global.window.DINO_DATA }; };
for (const [name, dir] of [['main', base + 'maintree/rex-strength-lab'], ['branch', base + 'repo/rex-strength-lab']]) {
  const { P, D } = load(dir), g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), s = D.surfaces.find((x) => x.id === 'concrete');
  for (const anchor of ['friction', 'bolted']) for (const oid of ['car', 'baseball', 'bus']) {
    const c = { F: 90718.474 * g, mode: 'comic', body, surface: s, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const o = { near: 5, obj: D.objects.find((x) => x.id === oid), surface: s, body, anchor, ownRecoil: true, unbreakable: true, airAbsorb: 1, keepForm: true };
    const r = P.pull(c, o.obj), src = P.RESTRAINT.MOVES.pull.shake(r, o);
    const reach = P.RESTRAINT.reach('pull', r, o);
    console.log(name, anchor, oid, 't', r.t10m.toFixed(4), 'v', r.vEnd.toFixed(2), 'ppv5', src ? P.ppvAt(src, 5).toPrecision(3) : null, 'walk', r.walkPush ? (r.walkPush.J / r.walkPush.T / r.usable).toFixed(3) + 'x' : '-', 'reach', JSON.stringify(reach));
  }
}
