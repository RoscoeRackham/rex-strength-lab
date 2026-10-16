const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, oNoKnockback: false, silentStrike: false, softLanding: false };
const S = []; const add = (name, st, effort, click) => S.push({ name, st, effort, click });
for (const L of [null, 9, 12]) for (const e of ['least', 'allout']) {
  const lk = L ? { logKg: L } : {};
  add('jump nosoft ' + (L || 'dial') + ' ' + e, Object.assign({ action: 'jump' }, lk), e);
  add('sprint ' + (L || 'dial') + ' ' + e, Object.assign({ action: 'sprint' }, lk), e);
  add('lift ' + (L || 'dial') + ' ' + e, Object.assign({ action: 'lift', obj: 'car' }, lk), e);
  add('pull ' + (L || 'dial') + ' ' + e, Object.assign({ action: 'pull' }, lk), e);
  add('walk ' + (L || 'dial') + ' ' + e, Object.assign({ action: 'walk' }, lk), e);
}
add('jump soft 1e12 allout', { action: 'jump', softLanding: true, logKg: 12 }, 'allout');
add('weight off krakatoa', Object.assign({ action: 'weight' }, OFF), null, '#grow-what-krakatoa');
add('weight bolted krakatoa', { action: 'weight', anchor: 'bolted' }, null, '#grow-what-krakatoa');
add('stomp soft? growth instant', { action: 'stomp', absorb: 'instant' }, 'allout');
add('punch silent ceiling 1e9', { action: 'punch', silentStrike: true, logKg: 9 }, 'ceiling');
add('throw car ceiling', { action: 'throw', obj: 'car' }, 'ceiling');
add('throw car 1e9 ceiling', { action: 'throw', obj: 'car', logKg: 9 }, 'ceiling');
add('stomp 1e9 ceiling', { action: 'stomp', logKg: 9 }, 'ceiling');
add('stomp 1e9 ground', { action: 'stomp', logKg: 9 }, 'ground');
fs.writeFileSync('scen2.json', JSON.stringify(S)); console.log(S.length);
