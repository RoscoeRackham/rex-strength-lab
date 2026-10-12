global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const out = { crash: [], falseUnreach: [], falseNone: [] };
const objs = ['car', 'tank', 'bus', 'semi', 'piano', 'person', 'loco', 'baseball'];
const moves = process.argv[2] ? process.argv[2].split(',') : ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'];
for (const mv of moves) for (const sid of ['concrete', 'granite', 'sand', 'softclay']) for (const gh of [false, true]) for (const mode of ['comic', 'real']) for (const lk of [5, 6, 7, 8, 9, 10, 12, 'inf']) for (const oid of (mv === 'throw' || mv === 'pull' ? objs : ['-'])) {
  const sf = D.surfaces.find((s) => s.id === sid), o = D.objects.find((x) => x.id === oid);
  const F = lk === 'inf' ? Infinity : Math.pow(10, lk) * g;
  const c = { F, mode, body: rex, surface: sf, groundHolds: gh, anchor: 'friction' };
  const target = { throw: 30, jump: 3, stomp: undefined, punch: 10.4, clap: 9.43, sprint: 12.42, pull: 10 }[mv];
  const opt = Object.assign({ target }, o ? { obj: o, angle: 45 } : {});
  let p;
  try { p = P.RESTRAINT.planNow(mv, c, opt); } catch (e) { out.crash.push([mv, sid, gh, mode, lk, oid, 'plan ' + e.message]); continue; }
  const M = P.RESTRAINT.MOVES[mv];
  const gl = p.goal();
  const allout = p.run(undefined);
  const key = [mv, sid, 'gh=' + gh, mode, lk, oid].join(' ');
  if (!gl.reached && M.goal(allout, p.opt)) out.falseUnreach.push(key);
  const want = gl.reached ? gl.use : undefined;
  const rr = p.run(want);
  const hz = P.RESTRAINT.HAZARDS.filter((h) => h.test(M, rr, p.opt)).map((h) => h.id);
  const ce = p.ceiling();
  if (hz.length && !ce.by) out.crash.push(key + ' hazards at shown effort: ' + hz.join(','));
  const hzAll = P.RESTRAINT.HAZARDS.filter((h) => h.test(M, allout, p.opt)).map((h) => h.id);
  if (!ce.by && hzAll.length) out.falseNone.push(key + ' all-out hazards: ' + hzAll.join(','));
}
console.log('crash (least-disruptive throws):', out.crash.length); console.log(out.crash.slice(0, 40).join('\n'));
console.log('goal falsely unreachable:', out.falseUnreach.length); console.log(out.falseUnreach.slice(0, 40).join('\n'));
console.log('ceiling none but all-out harms:', out.falseNone.length); console.log(out.falseNone.slice(0, 40).join('\n'));
