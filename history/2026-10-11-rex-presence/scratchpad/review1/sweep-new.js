// Sweep the new engine paths (effort, presence, growth) for NaN / negative values
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const bad = [];
const scan = (label, obj, path = '', depth = 0) => {
  if (obj == null || depth > 6) return;
  if (typeof obj === 'number') { if (Number.isNaN(obj)) bad.push(label + ' ' + path + ' = NaN'); else if (obj < 0 && !/quake|lnr|dH|dV|dR|dBind/i.test(path)) bad.push(label + ' ' + path + ' = ' + obj); return; }
  if (Array.isArray(obj)) { obj.forEach((x, i) => scan(label, x, path + '[' + i + ']', depth + 1)); return; }
  if (typeof obj === 'object') for (const [k, v] of Object.entries(obj)) if (k !== 'path' && k !== 'gLoad' && typeof v !== 'function') scan(label, v, path + '.' + k, depth + 1);
};
const bodies = { rex: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie: P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie)), small: P.makeBody({ H: 0.4 }), big: P.makeBody({ H: 50 }) };
// effort: use at various fractions
for (const [bn, body] of Object.entries(bodies)) for (const lg of [2.708, 4, 9, Infinity]) for (const mode of ['comic', 'real']) for (const surface of D.surfaces) for (const anchor of ['friction', 'bolted']) {
  const F = isFinite(lg) ? Math.pow(10, lg) * g : Infinity;
  for (const use of [1e-3, 0.01 * body.m * g, body.m * g, 3 * body.m * g, 1e6 * g, 1e30 * g, Infinity]) {
    const ctx = { F, use, mode, body, surface, groundHolds: false, anchor };
    const L = `${bn} lg=${lg} use=${use.toPrecision(3)} ${mode} ${surface.id} ${anchor}`;
    scan(L + ' jump', P.jump(ctx)); scan(L + ' stomp', P.stomp(ctx)); scan(L + ' punch', P.punch(ctx)); scan(L + ' clap', P.clap(ctx)); scan(L + ' sprint', P.sprint(ctx));
    scan(L + ' pull bus', P.pull(ctx, D.objects.find((o) => o.id === 'bus')));
    if (surface.id === 'concrete' && bn === 'rex') for (const o of D.objects.filter((o) => !o.noThrow)) scan(L + ' throw ' + o.id, P.throwObject(ctx, o, 45));
  }
}
// presence
for (const [bn, body] of Object.entries(bodies)) for (const surface of D.surfaces) for (const pace of ['stroll', 'walk', 'brisk', 'fast']) for (const effort of [0, 0.25, 0.5, 0.75, 1]) for (const gh of [false, true]) {
  const pr = P.presence(body, surface, { pace, effort, groundHolds: gh });
  const L = `${bn} ${surface.id} ${pace} e=${effort} gh=${gh}`;
  scan(L + ' presence', { step: pr.step, reach: pr.reach, p1: pr.ppv(1), p5: pr.ppv(5), p100: pr.ppv(100) });
}
// growth
for (const [bn, body] of Object.entries(bodies)) for (const E of [0, 1, 1e10, 8.4e17, 4.2e23, 3.8e26, 1e40, 1e60]) for (const form of ['mix', 'size', 'density', 0.3]) {
  const L = `${bn} E=${E} ${form}`;
  scan(L + ' grown', P.grownBody(body, E, form)); scan(L + ' gradual', P.gradualGrowth(body, E, form)); scan(L + ' instant', P.instantGrowth(body, E, form)); scan(L + ' runaway', P.runawayGrowth(body, E, form));
}
console.log('problems', bad.length);
const groups = {};
for (const b of bad) { const k = b.replace(/[\d.e+-]+/g, '#'); groups[k] = groups[k] || b; }
console.log(Object.values(groups).slice(0, 40).join('\n'));
