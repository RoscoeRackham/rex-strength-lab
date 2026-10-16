// round 1's page fixes reverted (code-2's page words, code-4's effort and floor note), each against shots --pr5
const A = 'src/app.html';
const T = 'node test/shots.js --pr5';
const m = (id, find, replace) => ({ id, file: A, find, replace, cmd: T, build: true });
module.exports = [
  m('R-page-code2-escape-words', "(real && !real.landed ? ' (real air wouldn’t bring it down: this is the drag on its way out, and it leaves with the rest of its energy)' : '')", "(Math.abs(dragJ - r.Eobj) <= 1e-9 * r.Eobj ? ' (all of its energy: real air wouldn’t bring it down)' : '')"),
  m('R-page-code2-rel-words', "if (f.relativistic) items.push(fastThrowText(r, c, o, fa) + (tb.parts.drag > 0 && isFinite(tb.parts.drag) ?", "if (f.relativistic) items.push(fastThrowText(r, c, o, fa) + (false ?"),
  m('R-page-code4-floor-note', "+ (gl.word === 'too faint to see' ? ' The lab draws no glow below ' + floorRef.short + ' (' + fmtSI(floorRef.J, 'J') + '), its floor: a proposal, not canon.' : '')", ''),
  m('R-page-code4-effort', "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "const cAll = Object.assign({}, c); delete cAll.use; const tb = takenBack('throw', P.throwObject(cAll, o, state.angle), Object.assign({}, cAll, { obj: o, angle: state.angle }));"),
];
