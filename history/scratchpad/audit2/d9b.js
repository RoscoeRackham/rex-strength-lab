global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const r of D.sourceRows) if (/Spider|Hulk|Thor|Bolt|Wukong|jin|ton/i.test(r.label)) console.log(r.status.padEnd(14), r.label, '|', r.value);
for (const t of D.tiers) if (/spidey|hulk|cap/.test(t.id)) console.log('tier', t.id, t.status, Object.keys(t));
