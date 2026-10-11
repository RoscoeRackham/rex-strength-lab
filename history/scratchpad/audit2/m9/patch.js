const fs = require('fs');
let s = fs.readFileSync('patched.html', 'utf8');
const old = "'Footing (just standing) = μ × his weight = ' + sig(c.surface.mu, 2) + ' × ' + sig(c.body.m, 3) + ' kg × 9.81' + (state.anchor === 'braced' ? ' + shear × claw area' : '')";
const neu = "footingLine(c, r.anchor)";
if (!s.includes(old)) throw 'no match';
s = s.replace(old, neu);
const fn = `function footingLine(c, a) {
    if (state.anchor === 'bolted') return 'Footing (bolted to the planet): unlimited, a comic anchor';
    const claws = state.anchor === 'braced';
    const load = a.normalCapped ? 'what the ground can bear (' + fmtSI(a.Nmax, 'N') + ')' : sig(c.body.m, 3) + ' kg × 9.81';
    return 'Footing (' + (claws ? 'claws dug in' : 'just standing') + ') = μ × ' + (a.normalCapped ? 'ground bearing' : 'his weight') + (claws ? ' + shear × claw area' : '') +
      ' = ' + sig(c.surface.mu, 2) + ' × ' + load + (claws ? ' + ' + fmtSI(c.surface.shear, 'Pa') + ' × ' + sig(c.body.digArea, 2) + ' m²' : '') + ' = ' + fmtSI(a.R, 'N');
  }
  function bayPull(c) {`;
s = s.replace('function bayPull(c) {', fn);
fs.writeFileSync('patched.html', s);
