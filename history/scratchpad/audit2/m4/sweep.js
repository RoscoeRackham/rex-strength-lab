global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
let tot=0, near=0, below=0, above=0; const ex=[];
const lgs=[]; for (let x=2.5;x<=34;x+=0.25) lgs.push(x);
for (const lg of lgs) for (const mode of ['comic','real']) for (const H of [0.4,2,50]) for (const surface of D.surfaces) for (const gh of [false,true]) {
  const body = P.makeBody({H});
  const c = { F: Math.pow(10,lg)*g, mode, body, surface, groundHolds: gh, anchor:'friction' };
  const r = P.jump(c); const f=r.flight;
  if (!r.relativistic && !f.escaped && f.apex > 20) {
    tot++; const q = f.vImpact/r.vTerminal;
    if (q<0.8) below++; else if (q>1.2) above++; else near++;
    if (H===2 && surface.id==='concrete' && !gh && mode==='comic') ex.push([lg.toFixed(2), f.apex.toFixed(1), f.vImpact.toFixed(1), r.vTerminal.toFixed(1), q.toFixed(2)].join(' '));
  }
}
console.log({tot, near, below, above});
console.log('lg apex vImp vTerm ratio (H=2 concrete comic)'); console.log(ex.join('\n'));
// Default tiers
for (const t of D.tiers) { const body=P.makeBody({H:2}); const surf=D.surfaces.find(s=>s.id==='concrete'); const r=P.jump({F:t.liftKg*g, mode:'comic', body, surface:surf, groundHolds:false, anchor:'friction'}); const f=r.flight; console.log(t.label, isFinite(t.liftKg)? t.liftKg.toExponential(2):'inf', 'apex', f.apex&&f.apex.toFixed(1), 'vImp', f.vImpact&&f.vImpact.toFixed(1), 'vT', r.vTerminal.toFixed(1), f.escaped?'ESC':'', r.relativistic?'REL':'', (f.apex>20 && !f.escaped && !r.relativistic)?'BULLET ratio '+(f.vImpact/r.vTerminal).toFixed(2):''); }
