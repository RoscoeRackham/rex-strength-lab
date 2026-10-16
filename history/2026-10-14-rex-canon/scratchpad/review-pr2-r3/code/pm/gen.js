const fs = require('fs'), path = require('path');
const M = {
  'allReach-false': ["out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));", "out.allReach = false;"],
  'allReach-true': ["out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));", "out.allReach = true;"],
  'thrown-false': ["out.thrown = legs.some((L) => !!(L && (L.recoilAbsorbedT || L.toGroundT)));", "out.thrown = false;"],
  'thrown-true': ["out.thrown = legs.some((L) => !!(L && (L.recoilAbsorbedT || L.toGroundT)));", "out.thrown = true;"],
  'caught-false': ["out.caught = !!t.catch;", "out.caught = false;"],
  'caught-true': ["out.caught = !!t.catch;", "out.caught = true;"],
  'topU-hi': ["const topU = isFinite(Math.max(fullF('R'), fullF('O'))) ? eff.p.hi : Infinity", "const topU = eff.p.hi"],
  'topU-inf': ["const topU = isFinite(Math.max(fullF('R'), fullF('O'))) ? eff.p.hi : Infinity", "const topU = Infinity"],
  'pullOnWhy-bolted-text': ["'Bolted, nothing caps it, so a quick, hard pull shakes the ground.'", "'His grip caps it (his footing, about ' + fmtSI(P.pull(ctx(), o).anchor.R, 'N') + ' here), so it stays small.'"],
  'hazlist-pull-on-none': ["else if (move === 'pull') items.push(el('li', {}, el('b', { text: 'Ground shaking' }), ': from his own steps only", "else if (false) items.push(el('li', {}, el('b', { text: 'Ground shaking' }), ': from his own steps only"],
  'hazlist-pull-off-generic': ["move === 'pull' ? ': not counted with They take their own recoil off (as before the power existed).' : ': not modelled for this move.'", "': not modelled for this move.'"],
  'landGap-noAllReach': ["f.models.shake && !f.shake.length && !f.allReach && f.thrown ? catchLandWhy() : null", "f.models.shake && !f.shake.length && f.thrown ? catchLandWhy() : null"],
  'landGap-none': ["f.models.shake && !f.shake.length && !f.allReach && f.thrown ? catchLandWhy() : null", "false ? catchLandWhy() : null"],
  'pull-item-walk-none': ["+ (wp ? ' His own steps still push on the ground", "+ (false ? ' His own steps still push on the ground"],
  'pull-item-friction-cap-text': ["' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).'", "' (bolted, nothing caps it: the quicker the pull, the harder his feet push).'"],
  'noteFn-pullOnWhy-none': ["+ (move === 'pull' && !noShake(move) && (e === 'plaster' || e === 'rattle') ? ' ' + pullOnWhy() : '')", "+ ''"],
  'setaside-factsTop': ["if (eff.real && eff.p.factsAt(eff.p.hi, 'real').models.ground)", "if (eff.real && factsTop('real').models.ground)"],
};
for (const [k, [a, b]] of Object.entries(M)) fs.writeFileSync(path.join(__dirname, k + '.js'), `const fs=require('fs'),p=process.argv[2]+'/src/app.html';const s=fs.readFileSync(p,'utf8');const a=${JSON.stringify(a)},b=${JSON.stringify(b)};const n=s.split(a).length-1;if(n!==1){console.error('count '+n);process.exit(1);}fs.writeFileSync(p,s.replace(a,()=>b));`);
console.log(Object.keys(M).join(' '));
