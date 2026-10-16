// ladder (glow) mutants, each against node test/ladder.js
const F = 'src/ladder.js';
const T = 'node test/ladder.js';
const m = (id, find, replace) => ({ id, file: F, find, replace, cmd: T });
module.exports = [
  m('L01-tie-upper', 'if (Math.abs(lv - s.level) < Math.abs(lv - best.level)) best = s;', 'if (Math.abs(lv - s.level) <= Math.abs(lv - best.level)) best = s;'),
  m('L02-floor-key', "floor: 'energy_usain_bolt_top_speed'", "floor: 'energy_fastest_pitch_kinetic'"),
  m('L03-no-hold', 'const lv = Math.min(1, level);', 'const lv = level;'),
  m('L04-never-roughly', "(best.rough ? 'roughly ' : 'about ')", "('about ')"),
  m('L05-flicker-boundary', 'if (J < fl.J) return', 'if (J <= fl.J) return'),
  m('L06-strength-from-flicker', 'const strength = Math.min(1, Math.max(0, (level - floorLevel) / (1 - floorLevel)));', 'const strength = Math.min(1, Math.max(0, level));'),
  m('L07-held-at-flare', "held: level > 1 });", "held: level >= 1 });"),
  m('L08-roughAt-false', 'const roughAt = (e) => { const c = compare(e, refs); return !!(c.ref && c.ref.rough); };', 'const roughAt = (e) => false;'),
  m('L09-step-energy', 'Je = level === 0 ? fl.J : level === 1 ? fx.J : e;', 'Je = level === 0 ? fl.J : level === 1 ? fx.J : e * 1.5;'),
  m('L10-unbounded-strength', "return Object.assign(out, { unbounded: true, level: 1, strength: 1,", "return Object.assign(out, { unbounded: true, level: 1, strength: 0.9,"),
  m('L11-floor-boundary', 'if (J < fo.J) return', 'if (J <= fo.J) return'),
  m('L12-step-quarter', "['faint glow', 0.25, 'a faint glow']", "['faint glow', 0.3, 'a faint glow']"),
  m('L13-flare-step-rough-from-compare', 'rough: level === 1 ? !!fx.rough : roughAt(Je)', 'rough: roughAt(Je)'),
  m('L14-negative-none', 'if (!(J > 0) || !isFinite(J)) return', 'if (!isFinite(J)) return'),
  m('L15-floor-strength-not-0', 'if (J < fo.J) return Object.assign(out, { level, strength: 0,', 'if (J < fo.J) return Object.assign(out, { level, strength,'),
  m('L16-rung-by-position', "const r = refs.find((x) => x.key === k);", "const r = refs.find((x) => x.key === k) || refs[0];"),
];
