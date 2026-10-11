const fs = require('fs');
const S = process.argv[2];
let e = fs.readFileSync(S + '/src/engine.js', 'utf8');
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); return s.replace(a, b); };
e = rep(e, "    R_E: 6.371e6,            // Earth mean radius, m\n",
  "    R_E: 6.371e6,            // Earth mean radius, m\n    R_HILL: 1.5e9,           // Earth's Hill radius a(m/3M_sun)^(1/3), m: past it the Sun's tide beats Earth's pull\n");
e = rep(e, "      if (c.escaped) { out.escaped = true; return out; }\n      if (c.orbit)",
  "      if (c.escaped) { out.escaped = true; return out; }\n      if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = (c.orbit ? c.ra : c.apexR) - R; return out; }\n      if (c.orbit)");
e = rep(e, "        if (c.escaped) { out.escaped = true; break; }\n        if (c.orbit)",
  "        if (c.escaped) { out.escaped = true; break; }\n        if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = Math.max(out.apex, (c.orbit ? c.ra : c.apexR) - R); break; }\n        if (c.orbit)");
e = rep(e, "      const r = Math.hypot(x, y);\n      const v = Math.hypot(vx, vy);\n      const hNow = r - R;\n",
  "      const r = Math.hypot(x, y);\n      if (r > K.R_HILL) { out.escaped = true; out.leavesHill = true; break; }\n      const v = Math.hypot(vx, vy);\n      const hNow = r - R;\n");
fs.writeFileSync(S + '/src/engine.js', e);

let a = fs.readFileSync(S + '/src/app.html', 'utf8');
// throw verdict + item
a = rep(a, "    else if (f.escaped) v = 'The ' + o.short + ' leaves Earth for good.';",
  "    else if (f.leavesHill) v = 'The ' + o.short + ' climbs past ' + fmtDist(K.R_HILL - K.R_E) + ', where the Sun’s pull beats Earth’s, and does not fall back.';\n    else if (f.escaped) v = 'The ' + o.short + ' leaves Earth for good.';");
a = rep(a, "    if (f.escaped) items.push('It leaves the atmosphere faster than escape velocity (11.2 km/s at the surface), so gravity never brings it back.');",
  "    if (f.leavesHill) items.push('It leaves the air just under escape speed, but its arc would top out beyond Earth’s Hill sphere (about 1.5 million km). Out there the Sun’s tide is stronger than Earth’s gravity, so it ends up orbiting the Sun instead of falling back.');\n    else if (f.escaped) items.push('It leaves the atmosphere faster than escape velocity (11.2 km/s at the surface), so gravity never brings it back.');\n    else if (f.landed && f.apex > 3.844e8) items.push('Its arc tops out beyond the Moon’s orbit (384,400 km). The sim counts Earth’s gravity only, so the flight time and landing spot are rough.');");
// jump verdict, tiles
a = rep(a, "    else if (f.escaped) v = 'Rex jumps clean off the planet.';",
  "    else if (f.leavesHill) v = 'Rex jumps past ' + fmtDist(K.R_HILL - K.R_E) + ', where the Sun’s pull beats Earth’s, and does not come back down.';\n    else if (f.escaped) v = 'Rex jumps clean off the planet.';\n    else if (f.timedOut) v = 'Rex is still in the air after ' + fmtTime(f.time) + ', ' + fmtDist(f.apex) + ' up.';");
a = rep(a, "      r.relativistic || f.escaped ? null : tile('Hang time', fmtTime(f.time), ''),",
  "      r.relativistic || f.escaped || f.timedOut ? null : tile('Hang time', fmtTime(f.time), ''),");
a = rep(a, "      r.relativistic || f.escaped ? null : tile('Comes back down at', speedOnly(f.vImpact), 'terminal speed ' + speedOnly(r.vTerminal))));",
  "      r.relativistic || f.escaped || f.timedOut ? null : tile('Comes back down at', speedOnly(f.vImpact), 'terminal speed ' + speedOnly(r.vTerminal))));");
a = rep(a, "    if (!r.relativistic && !f.escaped && f.apex > 50) items.push(isFinite(r.vacuumApex) ?",
  "    if (!r.relativistic && !f.escaped && f.apex > 50) items.push(r.vacuumApex < K.R_HILL - K.R_E ?");
a = rep(a, "    if (!r.relativistic && !f.escaped && f.apex > 20) items.push('He comes back down",
  "    if (!r.relativistic && !f.escaped && f.landed && f.apex > 20) items.push('He comes back down");
fs.writeFileSync(S + '/src/app.html', a);
console.log('patched');
